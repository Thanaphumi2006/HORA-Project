/**
 * Terms and Conditions copy.
 *
 * Held as data rather than JSX so the wording lives in one place and can be
 * reviewed without reading layout code.
 *
 * UNRESOLVED PLACEHOLDERS — these ship as literal brackets until filled in:
 *   [SUPPORT EMAIL]        sections 3, 6, 15, 16
 *   [13]                   section 5, minimum age
 *   [URL]                  section 10, privacy policy link
 *   [LEGAL ENTITY NAME] / [ADDRESS]   section 16
 *   Section 9 also carries an editorial instruction that must be resolved
 *   before release — it is marked as a `note` block so it renders visibly
 *   flagged rather than silently reading as terms.
 */

export type Block =
  | {type: 'p'; text: string}
  | {type: 'bullets'; items: string[]}
  | {type: 'crisis'; text: string; calls: {label: string; number: string}[]}
  | {type: 'note'; text: string};

export type Section = {n: string; title: string; blocks: Block[]};

export const TERMS_TITLE = 'Terms and Conditions';

export const TERMS: Section[] = [
  {
    n: '1',
    title: 'What HORA is',
    blocks: [
      {
        type: 'p',
        text: 'HORA is an entertainment and self-reflection app. It offers tarot-style card readings, daily horoscopes, journalling, and related content.',
      },
      {
        type: 'p',
        text: 'HORA does not predict the future. Our readings are generated content designed to prompt reflection. They are not forecasts, they are not based on any method of determining future events, and they carry no predictive power of any kind. Any resemblance between a reading and something that later happens is coincidence.',
      },
      {
        type: 'p',
        text: 'Every reading is offered as a question to consider, not an answer to accept. The interpretation is yours, and so is the decision that follows it.',
      },
      {
        type: 'p',
        text: 'You do not need to believe in astrology or tarot to use the App, and we do not present these traditions as fact.',
      },
    ],
  },
  {
    n: '2',
    title: 'Not professional advice',
    blocks: [
      {
        type: 'p',
        text: 'HORA is not a substitute for a qualified professional. Do not use it as one.',
      },
      {
        type: 'p',
        text: 'Specifically, nothing in the App is, or should be treated as:',
      },
      {
        type: 'bullets',
        items: [
          'Medical or mental-health advice. We do not diagnose, treat, or assess any physical or psychological condition, and we do not predict health outcomes. Never start, stop, or change any treatment, medication, or care plan because of something you read in the App. Speak to a doctor or licensed mental-health professional.',
          'Financial or investment advice. We do not tell you what to buy, sell, invest in, or avoid.',
          'Legal advice. We do not advise on your rights, obligations, contracts, or disputes.',
          'Relationship, career, or major-life instruction. Readings never direct you to take, leave, end, or begin anything.',
        ],
      },
      {
        type: 'p',
        text: 'If a reading appears to touch on any of these areas, treat it as a prompt to think — never as an instruction, and never as a reason to act without qualified advice.',
      },
    ],
  },
  {
    n: '3',
    title: 'Our content commitments',
    blocks: [
      {
        type: 'p',
        text: 'These are binding commitments about what the App will and will not say to you.',
      },
      {type: 'p', text: 'HORA will:'},
      {
        type: 'bullets',
        items: [
          'Frame every reading as a reflection prompt rather than a forecast.',
          'Keep a calm and hopeful tone, including on difficult themes.',
          'End on your choice, not on a prediction of what will happen.',
          'Stay with feelings and themes, and avoid real-world events, dates, and named people.',
          'Direct you to real help for health, financial, legal, or emotional difficulties.',
          'Use inclusive language that works whether or not you hold any particular belief.',
        ],
      },
      {type: 'p', text: 'HORA will not:'},
      {
        type: 'bullets',
        items: [
          'Make medical, psychological, financial, or legal claims, predictions, or diagnoses, or suggest you change any treatment.',
          'Predict harm, danger, betrayal, loss, or death, or deliver ominous or frightening readings.',
          'Claim to know the future or to have any predictive power.',
          'Issue instructions dressed as fate.',
          'Make deterministic claims about other people, or demean any person or group.',
          'Use guilt, shame, or urgency to pressure you, or encourage dependence on the App.',
        ],
      },
      {type: 'p', text: 'Lines we will not cross, under any circumstances:'},
      {
        type: 'bullets',
        items: [
          'No medical, psychological, financial, or legal advice or prediction.',
          'No fear, doom, or crisis content.',
          'No claim of real predictive power.',
          'No content that facilitates self-harm, including any mention of method.',
          'A crisis is always met with care and real resources — never with a reading.',
          'Nothing that pressures, shames, fosters dependence, or demeans anyone.',
        ],
      },
      {
        type: 'p',
        text: 'If you encounter content in the App that breaches any of the above, please report it to [SUPPORT EMAIL]. We treat these reports as urgent.',
      },
    ],
  },
  {
    n: '4',
    title: 'If you are struggling',
    blocks: [
      {
        type: 'crisis',
        text: 'If you are in immediate danger or thinking about harming yourself, stop reading this and contact emergency services on 191, or the Department of Mental Health hotline on 1323 (free, 24 hours, Thailand).',
        calls: [
          {label: 'Call 191 — emergency', number: '191'},
          {label: 'Call 1323 — mental health', number: '1323'},
        ],
      },
      {
        type: 'p',
        text: 'If our systems detect that you may be in crisis, the App will not return a reading. It will show you support information instead. This is deliberate and is not a malfunction.',
      },
      {
        type: 'p',
        text: 'We are not a crisis service, we do not monitor your account for emergencies, and you should never rely on the App to notice that something is wrong or to get help to you.',
      },
    ],
  },
  {
    n: '5',
    title: 'Eligibility and age',
    blocks: [
      {
        type: 'p',
        text: 'You must be at least [13] years old to use the App. If you are under 20 (the age of majority in Thailand), you may only use the App with the consent of a parent or guardian, and by using it you confirm you have that consent.',
      },
      {
        type: 'p',
        text: 'We ask for your date of birth to generate astrological content and to confirm you meet the minimum age. If we learn that an account belongs to someone below the minimum age, we will close it and delete the associated data.',
      },
    ],
  },
  {
    n: '6',
    title: 'Your account',
    blocks: [
      {
        type: 'p',
        text: 'You are responsible for your account and for anything done through it. Keep your password confidential, and tell us at [SUPPORT EMAIL] if you believe someone else has access.',
      },
      {
        type: 'p',
        text: "If you sign in with Google, your use of that service is also governed by Google's own terms and privacy policy. We receive only the information you authorise at sign-in.",
      },
      {
        type: 'p',
        text: 'You may delete your account at any time from within the App. Deletion is permanent.',
      },
    ],
  },
  {
    n: '7',
    title: 'Acceptable use',
    blocks: [
      {type: 'p', text: 'You agree not to:'},
      {
        type: 'bullets',
        items: [
          'Use the App to give anyone else medical, legal, financial, or psychological advice, or present its output as such.',
          'Present HORA content as a genuine prediction to anyone, including in resale or repackaging.',
          'Attempt to make the App produce content that breaches Section 3, including through prompt manipulation.',
          'Reverse-engineer, scrape, or copy the App or its content, except as permitted by law.',
          'Use the App to harass, deceive, or harm anyone.',
          'Access the App by automated means, or interfere with its operation or security.',
        ],
      },
      {
        type: 'p',
        text: 'We may suspend or close an account that breaches this section.',
      },
    ],
  },
  {
    n: '8',
    title: 'Your content',
    blocks: [
      {
        type: 'p',
        text: 'Journal entries and anything else you write remain yours. You grant us only the limited licence needed to store, process, and display that content back to you, and to operate the App.',
      },
      {
        type: 'p',
        text: 'We do not sell your journal entries, and we do not publish them.',
      },
      {
        type: 'p',
        text: 'Readings, card artwork, illustrations, the HORA name and logo, and the App itself belong to us or our licensors. You may share individual readings for personal, non-commercial purposes. Everything else requires our written permission.',
      },
    ],
  },
  {
    n: '9',
    title: 'Payments and subscriptions',
    blocks: [
      {
        type: 'note',
        text: 'Include only if you charge. Otherwise state: "The App is currently free to use."',
      },
      {
        type: 'p',
        text: 'Paid features are billed through the Apple App Store or Google Play under their terms. Prices are shown before purchase. Subscriptions renew automatically until cancelled, and you cancel through your store account, not through us. Refunds are handled by the store under its policy and, where they apply, under Thai consumer protection law.',
      },
      {
        type: 'p',
        text: 'We will never use urgency, guilt, or fear of missing a reading to sell you anything.',
      },
    ],
  },
  {
    n: '10',
    title: 'Privacy',
    blocks: [
      {
        type: 'p',
        text: 'Our handling of personal data is described in the Privacy Policy at [URL], which forms part of these Terms. We process personal data in accordance with the Personal Data Protection Act B.E. 2562 (2019).',
      },
      {
        type: 'p',
        text: 'Your date of birth and any journal content are personal data. Some of what you write may amount to sensitive personal data under the PDPA, and we handle it accordingly.',
      },
    ],
  },
  {
    n: '11',
    title: 'Availability and changes',
    blocks: [
      {
        type: 'p',
        text: 'We may change, suspend, or discontinue any part of the App. We will give reasonable notice of material changes where we can.',
      },
      {
        type: 'p',
        text: 'We may update these Terms. If a change materially affects your rights, we will notify you in the App or by email before it takes effect. Continuing to use the App after that means you accept the updated Terms.',
      },
    ],
  },
  {
    n: '12',
    title: 'Disclaimers',
    blocks: [
      {
        type: 'p',
        text: 'The App is provided "as is". To the fullest extent permitted by law, we make no warranty that it will be uninterrupted, error-free, or fit for any particular purpose.',
      },
      {
        type: 'p',
        text: 'We make no warranty of any kind regarding the accuracy, insight, or outcome of any reading, because readings are entertainment and make no predictive claim.',
      },
      {
        type: 'p',
        text: 'Nothing in these Terms excludes liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot be excluded under Thai law.',
      },
    ],
  },
  {
    n: '13',
    title: 'Limitation of liability',
    blocks: [
      {
        type: 'p',
        text: 'To the extent permitted by law, we are not liable for any decision you make based on App content, or for indirect or consequential loss.',
      },
      {
        type: 'p',
        text: 'Our total liability to you in any 12-month period is limited to the greater of the amount you paid us in that period, or THB 1,000.',
      },
      {
        type: 'p',
        text: 'This section does not limit your rights as a consumer under Thai law.',
      },
    ],
  },
  {
    n: '14',
    title: 'Termination',
    blocks: [
      {
        type: 'p',
        text: 'You may stop using the App and delete your account at any time.',
      },
      {
        type: 'p',
        text: 'We may suspend or terminate your access if you breach these Terms, if required by law, or if we discontinue the App. Sections 8, 12, 13, and 15 survive termination.',
      },
    ],
  },
  {
    n: '15',
    title: 'Governing law and disputes',
    blocks: [
      {
        type: 'p',
        text: 'These Terms are governed by the laws of Thailand. Disputes are subject to the exclusive jurisdiction of the courts of Thailand.',
      },
      {
        type: 'p',
        text: 'Please contact us first at [SUPPORT EMAIL] — most issues are resolved faster that way.',
      },
    ],
  },
  {
    n: '16',
    title: 'Contact',
    blocks: [
      {type: 'p', text: '[LEGAL ENTITY NAME]\n[ADDRESS]\n[SUPPORT EMAIL]'},
    ],
  },
];

export const TERMS_OUTRO =
  'HORA is entertainment. It does not predict the future, and it is not a substitute for professional care. If you are struggling, please talk to someone who can help.';
