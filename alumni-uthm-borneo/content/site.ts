/**
 * All editable portal copy and numbers live here.
 * Change a value, commit, and Netlify redeploys. No code changes needed.
 */

export const site = {
  brand: 'Alumni UTHM Borneo',
  chapter: 'Sarawak Chapter',
  formalName: 'Alumni UTHM Zon Borneo (Sarawak)',
  tagline: 'Connecting Alumni. Creating Opportunities. Giving Back.',
  supportingLine:
    'Platform jaringan, penglibatan dan sumbangan Alumni Universiti Tun Hussein Onn Malaysia di Sarawak dan Zon Borneo.',
  description:
    'Regional alumni engagement and contribution platform for Alumni UTHM Zon Borneo (Sarawak).',
  facilitator: 'KOBIS Berhad',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',

  links: {
    uthm: 'https://www.uthm.edu.my/',
    pkka: 'https://pkka.uthm.edu.my/',
    highlight: 'https://www.facebook.com/share/18758A2WR7/',
  },

  hero: {
    image: '/images/kuching-waterfront.jpg',
    imageAlt: 'Dragon boats moored on the Sarawak River, facing the State Legislative Assembly building in Kuching',
    imageCredit: 'Photo: alea Film on Unsplash',
  },

  about: [
    'Alumni UTHM Zon Borneo (Sarawak) serves as a regional platform connecting graduates of Universiti Tun Hussein Onn Malaysia who live, work and contribute across Sarawak and Borneo.',
    'Our focus is to strengthen alumni relationships, support career and talent development, encourage industry and university collaboration, contribute to alumni and community initiatives, and maintain a meaningful connection between alumni and UTHM.',
  ],

  focus: [
    { title: 'Alumni Network', text: 'Connecting UTHM alumni across Sarawak and Borneo.' },
    {
      title: 'Career & Talent',
      text: 'Supporting career opportunities, graduate development, upskilling and professional networking.',
    },
    { title: 'Community & Welfare', text: 'Supporting alumni and selected community initiatives.' },
    {
      title: 'University × Industry',
      text: 'Strengthening relationships between alumni, UTHM and industry partners.',
    },
  ],

  /** Edit freely once the exact figures are confirmed. */
  commitment: {
    title: 'Our Commitment to Future Graduates',
    lead: { value: 'RM15,000', label: 'Endowment Commitment' },
    items: [
      { value: '10 Years', label: 'Long-Term Support' },
      { value: 'Anak Sarawak', label: 'Special Graduate Recognition' },
    ],
    text: 'Alumni UTHM Zon Borneo is committed to building a lasting culture of giving back by supporting recognition and opportunities for future generations of UTHM graduates from Sarawak.',
    /** Optional small print under the figures, e.g. "Figures subject to final confirmation." */
    note: '',
  },
} as const;
