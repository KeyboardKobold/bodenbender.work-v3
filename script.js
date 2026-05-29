// ─── Date & ticket ID ──────────────────────────────────────────────────────
const now = new Date();
document.getElementById('report-date').textContent = now.toLocaleDateString('en-GB', {
  year: 'numeric', month: '2-digit', day: '2-digit'
});

const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
document.getElementById('ticket-id').textContent =
  `CB-${now.getFullYear()}-${String(dayOfYear).padStart(3, '0')}`;

// ─── Feature flags ─────────────────────────────────────────────────────────
const ENGLISH_CV_READY = false; // flip to true once Bodenbender_CV.pdf is in public/

// ─── State ─────────────────────────────────────────────────────────────────
const choices = { concern: null, subconcern: null, context: null };

// ─── Header status per step ────────────────────────────────────────────────
const HEADER = {
  'step-1': { status: 'OPEN',                cls: 'status-open' },
  'step-2': { status: 'INVESTIGATING',       cls: 'status-investigating' },
  'step-3': { status: 'QUALIFYING',          cls: 'status-neutral' },
  'step-4': { status: 'ASSESSING',           cls: 'status-neutral' },
  'step-5': { status: 'RESOLUTION PROPOSED', cls: 'status-resolved' },
};

function updateHeader(stepId) {
  const h = HEADER[stepId];
  const el = document.getElementById('header-status');
  el.textContent = h.status;
  el.className = 'meta-value ' + h.cls;

  if (stepId === 'step-5') {
    const assigned = document.getElementById('header-assigned');
    assigned.textContent = 'Christian Bodenbender';
    assigned.classList.remove('unassigned');
    if (choices.concern === 'security') {
      document.getElementById('severity-badge').style.color = 'var(--amber)';
    }
  }
}

// ─── Step transition ───────────────────────────────────────────────────────
let transitioning = false;

function goToStep(nextId) {
  if (transitioning) return;
  transitioning = true;

  const current = document.querySelector('.step.is-active');
  const next    = document.getElementById(nextId);

  if (nextId === 'step-3') populateStep3();
  if (nextId === 'step-5') populateStep5();

  current.classList.remove('is-active');
  current.classList.add('is-exiting');

  setTimeout(() => {
    current.classList.remove('is-exiting');
    next.classList.add('is-active', 'is-entering');
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateHeader(nextId);
    setTimeout(() => {
      next.classList.remove('is-entering');
      transitioning = false;
    }, 380);
  }, 260);
}

// ─── Accordion: close siblings when a system item opens ───────────────────
document.addEventListener('toggle', e => {
  const item = e.target.closest('.system-item');
  if (!item || !item.open) return;
  item.closest('.system-list')
    ?.querySelectorAll('.system-item[open]')
    .forEach(sibling => { if (sibling !== item) sibling.removeAttribute('open'); });
}, true); // capture phase — toggle doesn't bubble

// ─── Global click delegation ───────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-next]');
  if (!btn) return;
  if (btn.dataset.choice) choices[btn.dataset.choice] = btn.dataset.value;
  goToStep(btn.dataset.next);
});

// ─── Step 3 content ────────────────────────────────────────────────────────
const STEP3_DATA = {
  scale: {
    label:  '03 — QUALIFYING FACTORS — SCALE & DELIVERY',
    intro:  'The following systems confirm the engineer\'s qualifications for high-throughput, delivery-focused infrastructure.',
    items: [
      { name: 'Java',
        detail: 'Primary language. 7+ years in production systems. Core of the 3B messages/day pipeline at Cumulocity DataHub.' },
      { name: 'Apache Kafka',
        detail: 'Event streaming at scale. Message durability and ordering under sustained production load.' },
      { name: 'S3, Azure Data Lake',
        detail: 'Cloud data lake pipelines at industrial scale. Telemetry offloading from 25 million live devices.' },
      { name: 'Vert.x',
        detail: 'Real-time reactive systems. Event loop architecture for high-throughput, low-latency processing.' },
    ],
    cta: '[ CONFIRM — QUALIFYING CRITERIA MET ]',
  },
  security: {
    label:  '03 — QUALIFYING FACTORS — RESILIENCE & SECURITY',
    intro:  'The following systems confirm the engineer\'s qualifications for security-conscious, resilient infrastructure. Relevant to both incident recovery and cloud-native hardening.',
    items: [
      { name: 'Docker, Kubernetes',
        detail: 'Early adopter before enterprise adoption. Understands the isolation model, not just the deployment workflow.' },
      { name: 'Vert.x',
        detail: 'Real-time reactive systems. Rebuilt with data integrity checks baked into the architecture.' },
      { name: 'Security: CVE management · pentesting · SLI/SLA · SQL injection hardening',
        detail: 'Patches proactively the day CVEs publish. Studied pentesting to understand the attacker\'s perspective. Trained against injection vectors at the application layer.' },
      { name: 'Java',
        detail: 'Primary language. 7+ years. Every CVE relevant to the JVM ecosystem tracked and patched same-day.' },
    ],
    subchoicePrompt: 'What type of resilience challenge are you facing?',
    subchoices: [
      { value: 'ransomware', title: 'RANSOMWARE &amp; INCIDENT RECOVERY',
        sub: 'We\'ve been compromised. We need to rebuild and make sure it doesn\'t happen the same way again' },
      { value: 'cloudnative', title: 'CLOUD-NATIVE SECURITY ENGINEERING',
        sub: 'We\'re scaling cloud infrastructure and need security built in, not bolted on' },
    ],
  },
};

function populateStep3() {
  const d = STEP3_DATA[choices.concern] || STEP3_DATA.scale;
  document.getElementById('step-3').innerHTML = `
    <h2 class="section-label">${d.label}</h2>
    <p class="step-intro">${d.intro}</p>
    <ul class="system-list">
      ${d.items.map(item => `
        <li>
          <details class="system-item">
            <summary><span class="dot"></span><span class="item-name">${item.name}</span></summary>
            <p class="item-detail">${item.detail}</p>
          </details>
        </li>
      `).join('')}
    </ul>
    <p class="step-aside">He has shipped in both: startups where processes were invented as needed, and international R&amp;D teams where nothing moved without documentation. Equally comfortable establishing order where there is none and following it where it exists. He also has a dog. <span class="dog">🐕</span></p>
    ${d.subchoices ? `
      <p class="step-prompt">${d.subchoicePrompt}</p>
      <div class="choice-list">
        ${d.subchoices.map(c => `
          <button class="choice-item" data-choice="subconcern" data-value="${c.value}" data-next="step-4">
            <span class="choice-arrow">▸</span>
            <div class="choice-body">
              <span class="choice-title">${c.title}</span>
              <span class="choice-sub">${c.sub}</span>
            </div>
          </button>
        `).join('')}
      </div>
    ` : `
      <div class="step-actions">
        <button class="action-btn" data-next="step-4">${d.cta}</button>
      </div>
    `}
  `;
}

// ─── Step 5 content ────────────────────────────────────────────────────────
const STEP5_DATA = {
  'scale-fast': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian built structure in environments that didn\'t have it. He shipped at scale from startups running on momentum and improvisation, and maintained reliability under pressure. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss what you\'re building and how fast', 'Close the incident'],
    cta:        { text: '[ ASSIGN ENGINEER ]', mod: '' },
    postmortem: null,
  },
  'scale-structured': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian has operated in international R&D environments with defined processes and rigorous standards. He enforced SLAs before anyone asked, and shipped data infrastructure at 3 billion messages per day without critical incidents. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss the role, team, and existing architecture', 'Close the incident'],
    cta:        { text: '[ ASSIGN ENGINEER ]', mod: '' },
    postmortem: null,
  },
  'security-ransomware-fast': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian has the rare combination of understanding how attacks happen and knowing how to rebuild fast. He patched CVEs the day they published, studied pentesting to understand the attacker\'s perspective, and has run infrastructure at a scale where downtime has real downstream consequences. In a fast-moving team, he can start rebuilding before the postmortem is written. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss what was compromised and what needs rebuilding', 'Start immediately'],
    cta:        { text: '[ BRING HIM IN ]', mod: 'cta-button--amber' },
    postmortem: 'At some point, someone should understand how this got in, what it touched, and what structural change prevents it from happening the same way again. This is not always the moment for that conversation. When it is, the offer is open. The companies that run that postmortem don\'t get hit the same way twice.',
  },
  'security-ransomware-structured': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian has operated in international R&D environments where security was built into the process, not addressed after something broke. He tracked CVEs proactively, hardened against injection vectors at the application layer, and built infrastructure designed to surface failures before they become incidents. He knows how to rebuild with documentation. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss recovery plan, timeline, and structural hardening', 'Begin with the right person in the seat'],
    cta:        { text: '[ BRING HIM IN ]', mod: 'cta-button--amber' },
    postmortem: 'At some point, someone should understand how this got in, what it touched, and what structural change prevents it from happening the same way again. This is not always the moment for that conversation. When it is, the offer is open. The companies that run that postmortem don\'t get hit the same way twice.',
  },
  'security-cloudnative-fast': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian adopted Docker and Kubernetes before most enterprises knew the names. He understands the isolation model, not just the tooling. He has built cloud-native data pipelines handling 3 billion IoT messages per day across S3 and Azure Data Lake. In a fast-moving environment, he moves quickly without leaving security as an afterthought. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss cloud architecture and what needs to be hardened', 'Close the incident'],
    cta:        { text: '[ BRING HIM IN ]', mod: 'cta-button--amber' },
    postmortem: null,
  },
  'security-cloudnative-structured': {
    label:      '05 — PROPOSED RESOLUTION',
    assessment: 'Christian has built and maintained cloud-native infrastructure in international R&D environments with defined processes and rigorous standards. He understands container isolation from first principles, tracks the CVE landscape proactively, and has shipped data architecture at a scale where security failures have real operational consequences. He is available for a full-time role immediately.',
    steps:      ['Contact Christian Bodenbender', 'Discuss existing architecture, security posture, and what needs hardening', 'Begin with the right person in the seat'],
    cta:        { text: '[ BRING HIM IN ]', mod: 'cta-button--amber' },
    postmortem: null,
  },
};

function populateStep5() {
  const key = choices.concern === 'security'
    ? `security-${choices.subconcern}-${choices.context}`
    : `${choices.concern}-${choices.context}`;
  const d   = STEP5_DATA[key] || STEP5_DATA['scale-fast'];

  const postmortemHtml = d.postmortem ? `
    <div class="postmortem-note">
      <span class="note-label">NOTE — POSTMORTEM</span>
      <p>${d.postmortem}</p>
    </div>` : '';

  document.getElementById('step-5').innerHTML = `
    <h2 class="section-label">${d.label}</h2>
    <p class="resolution-assessment">${d.assessment}</p>
    <ol class="resolution-steps">
      ${d.steps.map(s => `<li>${s}</li>`).join('')}
    </ol>
    <div class="contact-list">
      <a href="mailto:bodenbender@protonmail.com" class="contact-item">
        <span class="contact-label">Email</span>
        <span class="contact-value">bodenbender@protonmail.com</span>
      </a>
      <a href="tel:+4917670150251" class="contact-item">
        <span class="contact-label">Phone</span>
        <span class="contact-value">+49 176 70150251</span>
      </a>
      <a href="https://bodenbender.work" class="contact-item">
        <span class="contact-label">Web</span>
        <span class="contact-value">bodenbender.work</span>
      </a>
    </div>
    <div class="attachments-section">
      <span class="attachments-label">Attachments</span>
      <!-- EN: set ENGLISH_CV_READY = true once the English CV is ready -->
      ${ENGLISH_CV_READY ? `
      <a href="/Bodenbender_CV.pdf" download class="attachment-item">
        <span class="attachment-type">PDF</span>
        <span class="attachment-name">Bodenbender_CV.pdf</span>
        <span class="attachment-lang">EN</span>
        <span class="attachment-dl">↓</span>
      </a>` : ''}
      <a href="/Bodenbender_Lebenslauf.pdf" download class="attachment-item">
        <span class="attachment-type">PDF</span>
        <span class="attachment-name">Bodenbender_Lebenslauf.pdf</span>
        <span class="attachment-lang">DE</span>
        <span class="attachment-dl">↓</span>
      </a>
    </div>
    <a href="mailto:bodenbender@protonmail.com" class="cta-button ${d.cta.mod}">${d.cta.text}</a>
    ${postmortemHtml}
  `;
}
