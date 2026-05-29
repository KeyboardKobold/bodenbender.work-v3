# Build Brief: bodenbender.work — Personal Portfolio Website

## Goal

Build a single-page portfolio website for Christian Bodenbender, a senior backend engineer
actively looking for a full-time hybrid or remote role. The site's sole job is to convert
a visitor into someone who reaches out to hire him.

There are two audiences: HR recruiters at creative tech companies browsing for talent, and
security-sensitive hiring managers at companies where infrastructure resilience is a real
concern — whether that means a recent incident, regulated infrastructure, or a team that
simply takes security seriously. Both land on the same URL, read the same report, and are
never asked to identify themselves. The site infers who they are from what they choose to
engage with and delivers the appropriate resolution.

---

## The Concept: Incident Report With Implicit Branching

The entire site is styled as an internal engineering **P1 Critical Incident Report**.

The incident: *"MISSING BACKEND ENGINEER — SYSTEMS AT RISK."*

The visitor reads a single coherent report about Christian — his skills, his history, his
value. Throughout the report, certain sections and items are security-tagged. The visitor
never sees this tagging. They just read and click what interests them. The site quietly
tracks whether their engagement pattern skews toward security-sensitive content.

By the time they reach the resolution section, the site already knows who they are.
The CTA, framing, and tone of the resolution have adapted to match. No explicit choice
was ever offered. No path was ever named.

**There is no triage screen. There is no fork. There is one report.**

---

## Implicit Branching Mechanic

### Signal detection

Certain interactive elements throughout the report are internally tagged as
`type: security`. The visitor sees no indication of this — the items look and behave
exactly like any other expandable element.

Security-tagged items include (at minimum):
- "Security: CVE management, pentesting fundamentals, SLI/SLA enforcement" in Affected Systems
- "Docker, Kubernetes — understands the container isolation model" in Affected Systems
- "Vert.x — real-time systems, rebuilt with integrity checks" in Affected Systems
- The security-focused detail lines in the 2017 and 2022 timeline entries
- Any callout in the Impact Assessment that references CVEs, pentesting, or system hardening

### Threshold

If the visitor expands **2 or more security-tagged items**, the resolution branch flips.
This threshold is intentional — one click could be curiosity, two or more is a pattern.

The flip happens silently. No announcement. No transition. When the visitor scrolls
to the resolution section (or if it is already in view), the content has already adapted.

### The visual cue

When the security threshold is crossed, the severity badge slowly transitions from
red to amber over approximately one second. No other visual change occurs at this moment.
The visitor who engaged with security content will notice it fits differently when they
reach the end. The visitor who did not will never know amber existed.

### State model

```
branch = 'engineer'  // default on load
securitySignals = 0  // increments on each security-tagged interaction

if (securitySignals >= 2) branch = 'security'
```

One variable. No router. No framework required.

---

## Site Structure

The page is one document from top to bottom. Sections reveal on scroll or expand on click.
Both audiences read the same body content — the branching affects only the resolution.

### Header (always visible on load)

```
INCIDENT REPORT
Severity:     P1 — CRITICAL
Status:       OPEN
Ticket ID:    CB-2025-001
Reported:     [current date, auto-generated]
Assigned to:  [UNASSIGNED]
```

Severity badge starts red. Pulses slowly. Transitions to amber if security threshold
is crossed — the only external signal that anything has changed.

---

### Section 1 — Incident Summary

> "A senior backend engineer capable of processing 3 billion IoT messages per day,
> enforcing SLAs under real production load, and patching CVEs before they make the
> news — is currently unassigned. Your data pipeline noticed."

---

### Section 2 — Affected Systems

A list of services with status dots. Each item expands on click to reveal one line of
real context about Christian's experience with it. Security-tagged items are marked
internally — the visitor sees no difference.

Items and their expand-text:

- **Java** — primary language, 7+ years in production systems
- **Kotlin, Python, Go** — comfortable across all three, picks the right tool
- **Apache Parquet, Dremio** — SQL analytics layer over offloaded telemetry data
- **S3, Azure Data Lake** — cloud data lake pipelines at industrial scale
- **Docker, Kubernetes** `[security-tagged]` — early adopter before enterprise adoption;
  understands the isolation model, not just the deployment workflow
- **Vert.x** `[security-tagged]` — real-time reactive systems; rebuilt with data integrity
  checks baked into the architecture
- **Apache Kafka** — event streaming at scale; message durability and ordering under load
- **Grafana** — custom integrations for IoT fleet monitoring
- **REST APIs, event-driven architectures** — standard production work
- **C / C89** — systems-level programming from university; knows what lives below the framework
- **Security: CVE management, pentesting, SLI/SLA, SQL injection hardening** `[security-tagged]`
  — patches proactively the day CVEs publish; studied pentesting to understand attacker
  perspective; trained against injection vectors at the application layer

The `[security-tagged]` notation is for the builder only. It must not appear in the UI.
These items look identical to all others. Their expand content naturally attracts
security-conscious readers without signalling anything.

---

### Section 3 — Timeline: Root Cause Analysis

**This section provides backing information only. Do not expose it in this format.**
The raw chronological history below exists so the agent understands Christian's career
arc — not so the site reproduces it as a timeline or work history. That is what the CV
is for. The site should draw on this information to support the incident report narrative:
reference scale, context, or pivotal moments where they strengthen the story. How that
manifests visually and structurally is the agent's design decision. A literal list of
dates and employers would undermine the format entirely.

Backing career data (do not render verbatim):

```
2012  [INIT]   First commit. Side job at Weclapp during school.
               Built automated E2E test framework with WebDriver.

2015  [EXPAND] University R&D. Eclipse Henshin — rule-based model
               transformation for Eclipse Modeling Framework.

2017  [SCALE]  Software AG Werkstudent. Real-time IoT analytics in
               Java + Vert.x. Adopted Docker and Kubernetes before
               most enterprises knew the names.

2019  [SHIP]   Tallence AG. Rotated through client stacks: payment
               interfaces, insurance calculators, IoT fleet monitoring
               with custom Grafana, voice product THOR.

2022  [P1]     Cumulocity DataHub, Software AG → Cumulocity GmbH.
               3,000,000,000 messages/day. 25M industrial devices.
               Gartner Magic Quadrant 2025. S3 + Azure Data Lake.
               Parquet pipelines. Dremio SQL layer. BI integrations.

NOW   [OPEN]   Unassigned. Available.
```

The 2017 entry can expand to reveal: *"Early container adoption meant learning the security
model before the tooling hid it. Vert.x event loop architecture required explicit reasoning
about failure modes."* — `[security-tagged]`

The 2022 entry can expand to reveal: *"At 3B messages/day across industrial infrastructure,
SLA breaches have downstream consequences. CVE triage was proactive, not reactive."*
— `[security-tagged]`

---

### Section 4 — Impact Assessment

Prose. This is where personality appears. Works for both audiences — no branching here.

> Christian has shipped in chaos and in structure. He joined startups where processes
> were invented as needed, and international R&D teams where nothing moved without
> documentation. He is equally comfortable establishing order where there is none
> and following it where it exists.
>
> He patches CVEs the day they publish. He enforces SLIs before anyone asks him to.
> He studied pentesting and low-level C systems engineering because he wanted to
> understand how things break, not just how to build them.
>
> He also has a dog. The dog did not contribute to any of the above, but ships on time.

The dog gets a small ASCII or pixel-art cameo here. Subtle — one or two characters max.
A reward for readers who get this far. Not a centerpiece.

---

### Section 5 — Resolution (branching)

This section has two states. It renders based on the current value of `branch`.
The visitor never sees both. The transition between states is instant if the threshold
is crossed before the visitor scrolls here; otherwise it has already resolved by the time
they arrive.

#### Resolution — branch: `engineer` (default)

```
PROPOSED RESOLUTION
───────────────────
Step 1: Contact Christian Bodenbender
Step 2: Discuss role, team, and what you're building
Step 3: Close the incident
```

Contact options (all three, styled as actionable line items):
- Email: bodenbender@protonmail.com
- Phone: +49 176 70150251
- Web: www.bodenbender.work

Primary CTA button (red): **[ ASSIGN ENGINEER ]**
Triggers mailto or expands contact options — builder's discretion.

---

#### Resolution — branch: `security`

```
PROPOSED RESOLUTION
───────────────────
Step 1: Contact Christian Bodenbender
Step 2: Discuss what needs to be built, hardened, or rebuilt
Step 3: Begin with the right person in the seat
```

Same three contact options.

Primary CTA button (amber): **[ BRING HIM IN ]**

Below the contact block, the postmortem note appears. This only renders in the
security branch. Style it distinctly: subtle amber left border, muted text, small
`NOTE` label in monospace caps.

> **NOTE — POSTMORTEM**
>
> Most systems have a story about why something broke. The engineers worth keeping
> are the ones who read that story before they have to live it.
>
> Christian has made a habit of treating the postmortem as documentation, not
> aftermath. The offer to do that work is always open.

---

## Visual Design Direction

**Aesthetic:** Internal ops tooling. PagerDuty, Linear, a stripped-down console.
Monospace for structure, humanist sans-serif for prose. Dark mode only.

**Color palette:**
- Background: `#0d0d0d` — near-black
- Surface: `#1a1a1a` — cards and bordered blocks
- Body text: `#e8e8e8`
- Metadata / labels: `#888`
- Red `#e53e3e` — default severity badge, status dots, Branch A CTA
- Amber `#d97706` — security-branch badge, status dots, Branch B CTA
- Muted green `#4ade80` at ~30% opacity — timeline/code accents, used sparingly

The badge color transition (red → amber) is the single external signal of a branch flip.
It should be a CSS transition, approximately 1 second, `ease-in-out`. No other elements
change appearance when the branch flips.

**Typography:**
- Structure, labels, IDs, code: monospace (JetBrains Mono or IBM Plex Mono from Google
  Fonts; system monospace as fallback)
- Prose: Inter or DM Sans
- No decorative fonts.

**Layout:**
- Single column, centered, max-width 720px
- Generous vertical whitespace between sections
- Sections as bordered cards or ruled dividers
- Mobile-first. All tap targets minimum 44px.

**Motion:**
- Severity badge: slow pulse, 2s `ease-in-out`, infinite
- Badge color transition on branch flip: ~1s `ease-in-out`
- Section reveals: fade-in on scroll
- No parallax. No scroll-jacking. No other looping animations.

**Footer (always visible):**
```
Christian Bodenbender · Marburg, Germany · bodenbender@protonmail.com
Full-time · Hybrid or Remote · Java · Kotlin · Python · Go
```

---

## Interaction Design

- Page loads directly to the incident report. No triage screen, no splash.
- Security signal tracking begins immediately on first interaction.
- Sections reveal on scroll (preferred) or expand on click. Must feel like reading a
  document, not playing a game.
- Contact details always visible without any interaction. Never gated.
- The primary CTA is always the most visually prominent interactive element on the page.
- No account creation, no forms beyond mailto, no cookie banner required.
- All interactions tap-friendly on mobile.
- The branch flip is invisible to the visitor. The only hint is the badge color.

---

## Tech Stack Recommendation

**Vanilla HTML + CSS + JavaScript**

The branching state is two variables and a comparison. No router, no framework, no
build step required. This is appropriate for the complexity level of the site and
trivial for a backend developer to maintain.

```js
let branch = 'engineer';
let securitySignals = 0;

function recordSecuritySignal() {
  securitySignals++;
  if (securitySignals >= 2 && branch !== 'security') {
    branch = 'security';
    applySecurityBranch(); // swap CTA, badge color, show postmortem note
  }
}
```

Astro 5.x with a single client island is acceptable if the builder prefers a build step.
No React, Vue, or Svelte unless there is a concrete reason.

Deploy target: Vercel or Netlify (static export). Domain: bodenbender.work.

---

## Tone and Copy Guidelines

**Both branches (body content):**
Write like a post-mortem, not a resume. The report speaks — Christian in first-person
is rare or absent. Short sentences. Technical vocabulary used correctly.

Never write: superlatives, LinkedIn warmth, buzzwords without substance, fintech
language (compliance, regulatory, KYC, AML).

**Engineer branch resolution:**
Dry, deadpan corporate satire carried through. The incident framing is the joke.
Content is real. Do not sacrifice information for the bit.

**Security branch resolution:**
Satire recedes. Pragmatic and direct. The postmortem note is matter-of-fact —
an offer, not a lecture. One paragraph. Leave it.

---

## Success Criteria

**Engineer branch:** A recruiter opens the site, skims the report, expands a few
general engineering items. Within 30 seconds they understand: Christian is a senior
backend engineer with high-scale production experience, he is available, and they
know how to contact him. The red badge and dry tone match the kind of team they are
recruiting for. They reach out or bookmark it.

**Security branch:** A hiring manager opens the site. They expand the CVE item, the
Docker item, the 2022 timeline detail. The badge shifts amber by the time they scroll
to the resolution. They see "BRING HIM IN" in amber and a postmortem note beneath it.
Within 5 minutes they have forwarded the link or reached out. They did not know they
were being routed. They just followed what was interesting to them — and arrived exactly
where they should have.

---

## Reference Material

**Name:** Christian Bodenbender
**Location:** Marburg, Germany
**Email:** bodenbender@protonmail.com
**Phone:** +49 176 70150251
**Website:** www.bodenbender.work
**Education:** B.Sc. Computer Science, TH Mittelhessen, 2019, grade 2.0
**Current role:** Software Engineer, IoT R&D, Cumulocity GmbH (August 2022 – present)
**Seeking:** Full-time backend developer, hybrid or fully remote
**Preferred stack (for roles):** Java, Kotlin, Python, Go — open to others
