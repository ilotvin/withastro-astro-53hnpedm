// src/config/projects.config.ts

export interface Project {
    slug: string;
    url: string;
    title: string;
    summary: string;
    tags: string[];
    funnel: string[];
    visible?: boolean;
    type?: 'astro' | 'markdown';
  }
  
  export const projectsConfig: Project[] = [
    {
      slug: 'v3-points',
      url: '/projects/v3-points',
      title: 'V3 Points',
      summary: 'Test page — placeholder detail view for the V3 Points project.',
      tags: ['Test page'],
      funnel: [],
      visible: flase,
      type: 'astro',
    },
    {
      slug: 'selling-points-analytics',
      url: '/projects/selling-points-analytics',
      title: 'Selling Points Analytics Data Extension',
      summary: 'Building an SFMC Data Extension that consolidates selling-point analytics from raw source data into a structured, reportable dataset surfaced on a landing page.',
      tags: ['Data Analytics'],
      funnel: ['Source Data', 'SQL Query', 'Analytics DE', 'Selling Points', 'Reporting'],
      visible: true,
      type: 'astro',
    },
    {
      slug: 'consent-sync',
      url: '/projects/consent-sync',
      title: 'Consent Sync',
      summary: 'Summary configuration loading from project file...',
      tags: [],
      funnel: ['Landing Page', 'Form Submit', 'API Trigger', 'Double Opt-In Email', 'Confirmation'],
      visible: true,
      type: 'astro',
    },
    {
      slug: 'ghl-conversations-messages',
      url: '/projects/ghl-conversations-messages',
      title: 'GHL Data Model: Conversations vs Messages',
      summary: 'Analysis of GoHighLevel\'s conversation and messaging API — the distinction between a mutable snapshot and an immutable historical log, and what each is useful for.',
      tags: ['Data Analytics', 'API'],
      funnel: ['Conversation', 'Message'],
      visible: true,
      type: 'astro',
    },
  ];
  
  // Funnel overrides for markdown projects
  export const funnelOverlays: Record<string, string[]> = {
    'sfmc-email-analytics': ['_Job', '_Sent', '_Open', '_Click', '_Bounce', '_Unsubscribe'],
  };
  
  // URL overrides for markdown projects
  export const urlOverrides: Record<string, string> = {
    'sfmc-email-analytics': '/projects/email-send-analysis',
  };