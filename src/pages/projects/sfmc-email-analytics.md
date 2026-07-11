---
title: "Email Analytics with Salesforce Marketing Cloud Data Views"
summary: "Deep hands-on knowledge of the SFMC email tracking data model — analysing the full send-to-engagement funnel via SQL, building rolling export pipelines into master Data Extensions, and diagnosing real deliverability and bounce problems."
---

# Project Overview

Focused expertise in analysing the email lifecycle inside Salesforce Marketing Cloud by querying its system data views directly. This work covers understanding how the tracking views relate, building a repeatable export pipeline that feeds master Data Extensions, and turning a real deliverability incident into a durable understanding of bounces and the metrics that describe them.

## The email data model

The email tracking data views form a funnel that all traces back to a single anchor:

- **`_Job`** — the anchor view; one row per send, keyed by `JobID`. Carries the send's identity: `EmailID` (the content asset), `EmailName`, `EmailSendDefinition` (the reusable send configuration), timings, and journey/triggered keys.
- **`_Sent`** — who the send was attempted to; the denominator for every rate.
- **`_Open` / `_Click`** — engagement events, with `_Click` carrying the `URL` and `LinkName` of the tapped link.
- **`_Bounce`** — delivery failures, with category, type, and SMTP reason.
- **`_Unsubscribe`** — opt-out events tied to the send.

Every event view joins back to `_Job` on `JobID`, with the composite `JobID` + `SubscriberKey` identifying a single subscriber's record within a send (plus `EventDate` where events repeat, such as multiple opens or clicks).

## Identifier modelling — knowing which key answers which question

A core piece of this knowledge is choosing the right identifier for the analytical question:

- **`JobID`** — one specific send (a single deployment).
- **`EmailID`** — the content asset itself; the same email sent several times shares one `EmailID` across different `JobID`s.
- **`EmailName`** — the human-readable label, useful for grouping but reusable/renamable, so less reliable than `EmailID`.
- **`EmailSendDefinition`** — the reusable send configuration (audience, classification, sender/delivery profiles), distinct from the content it references.
- **`TriggererSendDefinitionObjectID`** — the grouping key for journey and triggered sends, where `EmailSendDefinition` does not apply.

To analyse every send of one email, resolve the `EmailID` from `_Job`, then pull the tracking events for the resulting set of `JobID`s.

## Rolling 10-day export pipeline into master Data Extensions

Built a repeatable pipeline that exports the full email funnel on a rolling 10-day window and appends the results into master Data Extensions, so the analytical dataset stays current without re-pulling full history.

- **`_Job`** is windowed on `CreatedDate` — the only non-nullable date on the view. This is a deliberate choice: `DeliveredTime` is NULL for all triggered sends and `SchedTime` / `PickupTime` are nullable, so filtering on any of those would silently drop records from the window. `CreatedDate` guarantees every job in the period is captured.
- The event views (`_Sent`, `_Open`, `_Click`, `_Bounce`, `_Unsubscribe`) are windowed on their `EventDate`, then appended to their respective master DEs — each run adding the latest ten days of activity to the accumulating dataset.

## Deliverability & bounces — a diagnosed incident and the knowledge that came from it

### The error encountered

A send showed a large bounce count — thousands of failures on a single job. The instinctive read was "thousands of bad addresses to remove." Investigating the `_Bounce` detail proved that reading wrong, and that investigation is where the real understanding formed.

### What the analysis revealed

The bounces were not one problem but several, and only a minority were genuine dead addresses:

- **Block and technical push-backs** made up the majority — the receiving mail servers rejecting or deferring, not bad data on the sending side. A large share carried SMTP code **421** with Yahoo's message about messages being temporarily deferred due to unexpected volume or complaints — a **reputation / sending-volume signal**, not an address problem.
- **Hard bounces (SMTP 550)** — "bad destination mailbox" / "mailbox cancelled" — were the genuine list-hygiene portion: real dead addresses to scrub. These were only about a quarter of the total.
- Failures clustered heavily around a few ISPs (Yahoo plus Israeli providers), meaning a block at one or two of them drove a disproportionate share of the count.

### What this demonstrates knowing

The lesson — and the transferable knowledge — is that a raw bounce count must not be treated as bad-address count. Remediation has to target the actual cause: hard 550s call for list scrubbing, while block/deferral bounces point at sending reputation and volume, which is fixed on the sending side (send rate, IP warm-up, reputation) rather than by deleting addresses.

## Correct metrics — knowing what the numbers actually mean

Precise definitions that keep the analysis honest:

- **Sent** = rows in `_Sent`; this is *attempted* sends (send volume), not proof of inbox arrival.
- **Delivered** = `_Sent` minus anyone appearing in `_Bounce` for the same job. SFMC has no positive "delivered" confirmation view, so delivery is derived as "not bounced" — a simple, reliable rule rather than a fragile multi-condition check. It means "the mail server accepted it," not "reached the inbox."
- **Bounce rate** = bounces ÷ *sent* — never divided by delivered, since delivered is already sent-minus-bounce.
- **Hard-bounce rate** tracked separately as the true list-quality signal, so transient deferrals don't mask (or inflate) the real hygiene number.