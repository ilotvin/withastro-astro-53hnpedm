---
title: "Selling Points Analytics Data Extension"
summary: "Building an SFMC Data Extension that consolidates selling-point analytics from raw source data into a structured, reportable dataset."
tags: ["Data Analytics"]
---
# Project Overview

A repeatable process for building a Salesforce Marketing Cloud Data Extension that consolidates analytics for selling points, turning raw source data into a clean, structured dataset ready for reporting.

## The goal

Produce a single Data Extension that surfaces performance by selling point, so the results can be read and reported on directly without further manual assembly.

## The process

Extract the relevant records from the source data with SQL, shape them into a purpose-built Data Extension with explicit field types and a defined primary key, and structure the output so each row maps cleanly to a selling point and its associated metrics.

## Data Extension design

Fields are defined with appropriate types and lengths, with a primary key chosen to keep each selling-point record unique. The DE is refreshed on a schedule so the analytics stay current.

## Outcome

The resulting analytics page reads directly from this Data Extension, giving a clear, reportable view of selling-point performance.