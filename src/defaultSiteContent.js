/**
 * Default website copy/structure for CompassionateAlliance.
 * Seeded into Postgres on first deploy; admin edits override per section_key.
 */

const DEFAULT_SITE_SECTIONS = {
  hero: {
    kicker: 'Compassionate support • 24/7',
    titleLine1: 'FUNERAL SUPPORT TO ',
    titleAccent: 'QURESHI FAMILIES',
    titleSub: 'IN CASE OF SUDDEN DEATH',
    lead:
      'Providing compassionate support, financial assistance, and community care to families during their most difficult times.'
  },

  manifesto: {
    subtitle: 'Why this alliance exists, and what it provides in urgent times.',
    paragraphs: [
      {
        html:
          'The Compassionate Alliance is an organization which consists of Qureshi Families. The basic purpose of this organization is to facilitate all the members and their families (<strong>Parents, Grand Parents, Spouse, Un-Married Children and Un-Married Siblings</strong>) at the time of sudden death and its Funeral arrangements, i.e. <strong>Free Ambulance, Free Kafan, Free Graveyard Process, Free Tent & Catering Service and Free Food arrangements on Qul-Khawani.</strong>'
      },
      {
        html:
          "Everyone facing sad happenings/incidents in our everyday life and at that time, deceased family who facing this happening, can't arrange the Funeral activities due to the sad moments of life."
      },
      {
        html:
          'All the members of this organization will participate in facilitation of the Funeral Arrangements equally as per their duties assigned in the SOPs. Hopefully, these efforts will give some relief to the deceased families in their sad moments of life.'
      },
      {
        html: 'God may help us in continuation of this Nobel cause. (<strong>Aamin</strong>)',
        className: 'manifesto__closing'
      }
    ],
    stats: [
      {
        icon: 'Users',
        tone: 'green',
        title: '28 Families',
        text: 'United Qureshi community members'
      },
      {
        icon: 'Heart',
        tone: 'blue',
        title: 'Free Services',
        text: 'Complete funeral arrangements at no cost'
      },
      {
        icon: 'Shield',
        tone: 'purple',
        title: 'Community Support',
        text: 'Standing together in difficult times'
      }
    ]
  },

  compassionate_care: {
    eyebrow: 'What we provide',
    title: 'Compassionate Care',
    titleAccent: ' in case of Sudden Death',
    lede:
      'The organization stands with the bereaved family and coordinates dignified funeral support when it is needed most.',
    subtitleHighlight:
      'Free Ambulance, Free Kafan, Free Grave Yard Process, Free Tent & Catering Service, and Free Food Delivery on Qul-Khawani.',
    subtitlePrefix: 'Funeral arrangements include ',
    services: [
      { icon: 'Ambulance', title: 'Free Ambulance', description: 'Emergency transportation services available 24/7' },
      { icon: 'Heart', title: 'Free Kafan', description: 'Burial shrouds provided with dignity and respect' },
      { icon: 'MapPin', title: 'Free Grave Yard Process', description: 'Complete burial arrangements and procedures' },
      { icon: 'Home', title: 'Free Tent & Catering Service', description: 'Accommodation and food arrangements for mourners' },
      { icon: 'Utensils', title: 'Free Food Delivery on Qul-Khawani', description: 'Memorial meal arrangements and delivery' }
    ],
    ctaTitle: 'Need immediate assistance?',
    ctaText:
      'Our team is available around the clock for families in the Qureshi community during sudden loss.',
    phones: [
      { label: '+92 300 0797941', href: 'tel:+923000797941' },
      { label: '+92 300 6014081', href: 'tel:+923006014081' },
      { label: '+92 321 3616729', href: 'tel:+923213616729' }
    ],
    email: 'qureshicompassionatealliance@gmail.com',
    emailHref: 'mailto:qureshicompassionatealliance@gmail.com'
  },

  top_donors: {
    title: 'Top 3 Donor Members of the Month',
    meta: 'July 2025',
    subtitle: 'Following 3 members donated maximum contribution in the month of July 2025',
    donors: [
      {
        name: 'Sara Qureshi',
        amount: 'Rs. 20,000/-',
        rank: 1,
        image:
          'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
      },
      {
        name: 'Farhan Qureshi',
        amount: 'Rs. 15,000/-',
        rank: 2,
        image:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
      },
      {
        name: 'Amina Qureshi',
        amount: 'Rs. 10,000/-',
        rank: 3,
        image:
          'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
      }
    ],
    amountBlurbMonth: 'July 2025',
    ctaTitle: 'Become a Top Donor',
    ctaText:
      'Your generous contributions help us provide essential services to families in their time of need. Every donation makes a difference.'
  },

  founding_members: {
    subtitle: 'The visionary leaders who established Compassionate Alliance to serve the Qureshi community',
    imageUrl: '',
    imageAlt: 'Founding Members gathering at the time of Inauguration Meeting',
    captionHtml:
      '<strong>Founding Members gathering at the time of Inauguration Meeting of Compassionate Alliance (Qureshi Family)</strong>',
    dateLabel: '1st May 2025',
    firstRowTitle: '1st Row (Left to Right)',
    firstRow: ['Qamar Javed', 'Mazhar Hussain', 'Amir Javed', 'Muhammad Aslam', 'Muhammad Tahir'],
    secondRowTitle: '2nd Row (Left to Right)',
    secondRow: [
      'Muhammad Zahid',
      'Ameem Nawaz',
      'Ghulam Shabir',
      'Shehryar Mazhar',
      'Muhammad Noman',
      'Sher Afzal',
      'Sheraz Adil',
      'Waqar-ul-Qamar'
    ],
    legacyTitle: 'A Legacy of Compassion',
    legacyText:
      'These founding members laid the foundation for an organization built on compassion, unity, and service. Their vision continues to guide our mission of supporting families during their most difficult times.'
  },

  services_preview: {
    title: 'Our Services',
    subtitle:
      'Comprehensive support services designed to help families during their most challenging times',
    services: [
      {
        icon: 'Shield',
        color: 'red',
        title: 'Emergency Support',
        description:
          'Immediate assistance for families facing sudden loss, providing essential resources and guidance during critical times.'
      },
      {
        icon: 'Users',
        color: 'blue',
        title: 'Community Network',
        description:
          'Building strong community connections to ensure no family faces grief alone through our extensive support network.'
      },
      {
        icon: 'Heart',
        color: 'green',
        title: 'Compassionate Care',
        description:
          'Providing emotional and spiritual support to help families navigate through their most difficult moments.'
      }
    ]
  },

  members_preview: {
    title: 'Our Community',
    subtitle:
      'Join thousands of families who have found strength and support through our compassionate community',
    stats: [
      { icon: 'Users', label: 'Active Members', value: '2,500+' },
      { icon: 'Star', label: 'Families Helped', value: '1,200+' },
      { icon: 'Award', label: 'Years of Service', value: '15+' },
      { icon: 'TrendingUp', label: 'Success Rate', value: '98%' }
    ]
  },

  services_page: {
    heroTitle: 'Our Free Services',
    heroSubtitle:
      'Comprehensive free services designed to help Qureshi families during their most challenging times',
    services: [
      {
        icon: 'Ambulance',
        color: 'red',
        title: 'Free Ambulance Service',
        description:
          'We provide free Ambulance service to help families transport their loved one with care and respect during difficult time.'
      },
      {
        icon: 'Heart',
        color: 'blue',
        title: 'Free Kafan',
        description: 'We provide free Kafan with respect and Islamic Etiquette.'
      },
      {
        icon: 'MapPin',
        color: 'green',
        title: 'Free Graveyard Process',
        description: 'We help in Janaza and Grave preparation "Free of Cost".'
      },
      {
        icon: 'Home',
        color: 'purple',
        title: 'Free Tent & Catering',
        description:
          'We provide free Tent & Catering services to the deceased families from 1st day to end of Qul-Khawani.'
      },
      {
        icon: 'Utensils',
        color: 'orange',
        title: 'Free Food on Qul-Khawani',
        description: 'We provide free food (meal) on Qul-Khawani to all the gathering with love and hospitality.'
      }
    ],
    contactTitle: 'Need Our Services?',
    contactText:
      'Contact us immediately if you need any of our free services during your difficult time. Our compassionate team is available 24/7 to help.',
    phones: [
      { label: '+92 300 0797941', href: 'tel:+923000797941' },
      { label: '+92 300 6014081', href: 'tel:+923006014081' },
      { label: '+92 321 3616729', href: 'tel:+923213616729' }
    ],
    email: 'qureshicompassionatealliance@gmail.com',
    emailHref: 'mailto:qureshicompassionatealliance@gmail.com',
    office: 'Chamber Zulqarnain Qureshi, District Courts, Sargodha'
  },

  members_page: {
    heroTitle: 'Our Community',
    heroSubtitle:
      'Join our family of compassionate individuals dedicated to supporting each other during difficult times',
    stats: [
      { icon: 'Users', label: 'Active Members', value: '28' },
      { icon: 'Star', label: 'Families Helped', value: '150+' },
      { icon: 'Award', label: 'Years of Service', value: '1+' },
      { icon: 'TrendingUp', label: 'Success Rate', value: '100%' }
    ],
    membersTabTitle: 'Our Founding Members',
    membersTabSubtitle: 'Meet the dedicated individuals who founded and manage Compassionate Alliance',
    members: [
      {
        id: 1,
        name: 'Qamar Javed',
        designation: 'Founder',
        phone: '+92 300 1234567',
        email: 'qamar.javed@email.com',
        membership_number: 'QCA-001',
        image: 'https://randomuser.me/api/portraits/men/75.jpg'
      },
      {
        id: 2,
        name: 'Mazhar Hussain',
        designation: 'Finance Member',
        phone: '+92 300 2345678',
        email: 'mazhar.hussain@email.com',
        membership_number: 'QCA-002',
        image: 'https://randomuser.me/api/portraits/men/76.jpg'
      },
      {
        id: 3,
        name: 'Amir Javed',
        designation: 'Member',
        phone: '+92 300 3456789',
        email: 'amir.javed@email.com',
        membership_number: 'QCA-003',
        image: 'https://randomuser.me/api/portraits/men/77.jpg'
      }
    ],
    sidePhones: [
      { label: '+92 300 0797941', href: 'tel:+923000797941' },
      { label: '+92 300 6014081', href: 'tel:+923006014081' },
      { label: '+92 321 3616729', href: 'tel:+923213616729' }
    ],
    sideEmail: 'qureshicompassionatealliance@gmail.com',
    sideEmailHref: 'mailto:qureshicompassionatealliance@gmail.com',
    sideOffice: 'District Courts, Sargodha'
  },

  activities_page: {
    heroTitle: 'Community Activities',
    heroSubtitle:
      'Stay connected with our community through events, workshops, and support programs',
    sectionTitle: 'Recent Activities',
    sectionSubtitle:
      'Explore recent community activities and events that bring our families together and strengthen our bonds.',
    activities: [
      {
        title: 'Founding Members Meeting',
        date: '2025-05-01',
        participants: 28,
        images: [
          'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7414284/pexels-photo-7414284.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Inaugural meeting of founding members to establish the organization.'
      },
      {
        title: 'Community Gathering',
        date: '2025-06-15',
        participants: 50,
        images: [
          'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7551464/pexels-photo-7551464.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Community gathering to discuss organization goals and services.'
      },
      {
        title: 'Financial Planning Workshop',
        date: '2025-07-10',
        participants: 35,
        images: [
          'https://images.pexels.com/photos/7414284/pexels-photo-7414284.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7551468/pexels-photo-7551468.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Workshop on financial management and emergency fund planning.'
      },
      {
        title: 'Monthly Audit Meeting',
        date: '2025-07-30',
        participants: 15,
        images: [
          'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7414284/pexels-photo-7414284.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Monthly financial audit conducted by designated members.'
      },
      {
        title: 'Service Training Session',
        date: '2025-08-05',
        participants: 25,
        images: [
          'https://images.pexels.com/photos/7551464/pexels-photo-7551464.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Training session on funeral service procedures and protocols.'
      },
      {
        title: 'Annual Planning Meeting',
        date: '2025-08-20',
        participants: 28,
        images: [
          'https://images.pexels.com/photos/7551468/pexels-photo-7551468.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        description: 'Annual meeting to plan future activities and review organization progress.'
      }
    ],
    ctaTitle: 'Stay Connected',
    ctaText: 'Join our community activities and be part of our mission to support Qureshi families.',
    ctaButton: 'Get Involved'
  },

  donation_page: {
    heroTitle: 'Thank You for Your Kindness',
    heroSubtitle:
      'Your generous donation helps the Qureshi community during difficult times. Every contribution makes a meaningful difference.',
    accountsTitle: 'Bank Account Details',
    accountsSubtitle: 'Use any of the accounts below, then upload your slip to confirm.',
    bank: {
      bankName: 'UBL',
      accountNumber: 'PK75UNIL0109000329837675',
      accountTitle: 'Qureshi Compassionate Alliance'
    },
    jazzcash: {
      accountNumber: '03040571588',
      accountHolder: 'Muhammad Zulqafil Hashmi'
    },
    formTitle: 'Message from Donor',
    formSubtitle: 'Optionally include a short condolence message with your confirmation.',
    slipHint:
      'Please upload your donation slip so we can send you a confirmation message.'
  },

  support_page: {
    heroTitle: 'Support for Families',
    heroSubtitle: "We're here — our team is ready to provide immediate assistance.",
    title: 'Request Support',
    subtitle:
      'Please fill out this form so we can better understand your needs and provide appropriate assistance.'
  },

  about_page: {
    heroTitle: 'About Us',
    heroSubtitle:
      'Learn about our organization, mission, and the standard operating procedures that guide our work',
    missionTitle: 'Our Mission',
    missionText:
      'The Compassionate Alliance is an organization consisting of 28 families belonging to the Qureshi community. Our primary purpose is to facilitate all members and their families during sudden death and funeral arrangements, providing comprehensive support including free ambulance, kafan, tent & catering services, and food arrangements on Qul-Khawani.',
    sopsTitle: 'Standard Operating Procedures (SOPs)',
    sopsSubtitle:
      'Clear guidelines to ensure transparency, fairness, and effective service delivery to all members.',
    sops: [
      {
        id: 1,
        icon: 'Shield',
        title: 'Free Services Coverage',
        description:
          'The Compassionate Alliance will arrange Free Kafan, Free Ambulance, Free Graveyard Process, Free Tent & Catering and Free Food on Qul-Khawani.',
        note: 'If anyone wants to expand their funerals, the organization will not pay anymore.',
        color: 'blue'
      },
      {
        id: 2,
        icon: 'Users',
        title: 'Eligibility Criteria',
        description:
          'All members and their families (Parents, Grand Parents, Spouse, Unmarried Children, and unmarried Siblings) will be eligible.',
        color: 'green'
      },
      {
        id: 3,
        icon: 'Award',
        title: 'Honorary Membership',
        description:
          'In case of death of any founder member, the honorary membership will be continued for his family without membership contribution.',
        color: 'purple'
      },
      {
        id: 4,
        icon: 'BookOpen',
        title: 'Financial Transparency',
        description: 'All members have right to audit all the financial books at any time.',
        color: 'indigo'
      },
      {
        id: 5,
        icon: 'Calendar',
        title: 'Monthly Audit Process',
        description:
          'All books and ledgers should be audited at the end of every month by 3 members on their turn respectively. Auditors will sign the ledger book and upload picture of signed page with closing balance.',
        color: 'red'
      },
      {
        id: 6,
        icon: 'Users',
        title: 'Member Participation',
        description:
          'On Funeral arrangements, every member will participate as per their duties assigned by Organization.',
        color: 'orange'
      },
      {
        id: 7,
        icon: 'DollarSign',
        title: 'Financial Management',
        description:
          'Organization has UBL bank account (PK75UNIL0109000329837675) titled "Qureshi Compassionate Alliance" and Jazz Cash Account (03040571588) with Muhammad Zulqafil Hashmi. All expenses paid through cross cheque or bank transfer signed by Finance Members: Mazhar Hussain, Muhammad Aslam, Muhammad Zulqafil Hashmi.',
        color: 'green'
      },
      {
        id: 8,
        icon: 'DollarSign',
        title: 'Monthly Contribution',
        description:
          'Every member will deposit minimum Rs.500/- as membership contribution before 5th of every month. Deposit slip or Jazz Cash transaction should be uploaded in WhatsApp group.',
        note: 'Members contributing more will be featured as "DONOR OF THE MONTH" on website homepage.',
        color: 'blue'
      },
      {
        id: 9,
        icon: 'Globe',
        title: 'WhatsApp Group Guidelines',
        description:
          'All members will upload only relevant details, photos or videos in organization WhatsApp group. Personal, family or political discussions are not allowed.',
        color: 'yellow'
      },
      {
        id: 10,
        icon: 'Shield',
        title: 'Emergency Fund Protocol',
        description:
          'If organization has insufficient funds during an incident, members will meet funeral expenses and organization will reimburse when regular funds are available.',
        color: 'red'
      },
      {
        id: 11,
        icon: 'FileText',
        title: 'Organization Scope',
        description:
          'This organization is only for funeral arrangements of members and their families, not for other welfare or financial help.',
        color: 'gray'
      },
      {
        id: 12,
        icon: 'Users',
        title: 'New Membership',
        description:
          'New members must abide by all rules and regulations. They will be assigned membership numbers in sequence (29, 30, 31 onward).',
        color: 'purple'
      },
      {
        id: 13,
        icon: 'Award',
        title: 'Membership Benefits',
        description:
          'Organization will issue membership cards with Name, Picture and membership number. Annual UMRAH lucky draw will be held amongst all members. After performing UMRAH, member will be excluded from future draws.',
        color: 'gold'
      },
      {
        id: 14,
        icon: 'DollarSign',
        title: 'Audit Refreshments',
        description:
          'At monthly audit time, organization will pay refreshment expenses for tea and cookies (maximum Rs.1000/-).',
        color: 'brown'
      },
      {
        id: 15,
        icon: 'Calendar',
        title: 'Annual Meeting',
        description:
          'Yearly meeting cum get-together will be arranged for all members regarding issue redressal and organization welfare. Refreshment expenses will not exceed Rs.10,000/-.',
        color: 'teal'
      },
      {
        id: 16,
        icon: 'Users',
        title: 'Designation Changes',
        description:
          'All designations can be changed through voting on every 1st January except financial designations.',
        color: 'pink'
      },
      {
        id: 17,
        icon: 'Shield',
        title: 'Finance Member Replacement',
        description:
          'In case of death of finance member, Founder can replace with consent of all founder members/core committee.',
        color: 'cyan'
      },
      {
        id: 18,
        icon: 'Globe',
        title: 'Social Media Policy',
        description:
          'Organization will use Website, YouTube, Instagram, Facebook and TikTok. Nobody can post without permission of Information Secretary.',
        color: 'violet'
      },
      {
        id: 19,
        icon: 'FileText',
        title: 'Annual Reporting',
        description: 'Yearly audit report along with Balance sheet will be uploaded on website every 30th June.',
        color: 'emerald'
      },
      {
        id: 20,
        icon: 'Users',
        title: 'Community Conduct',
        description:
          'This is a social welfare organization of Qureshi family. No leg-pulling or back-biting allowed. Issues should be raised in monthly online meetings for resolution.',
        color: 'rose'
      }
    ],
    contactTitle: 'Contact Information',
    phones: [
      { label: '+92 300 0797941', href: 'tel:+923000797941' },
      { label: '+92 300 6014081', href: 'tel:+923006014081' },
      { label: '+92 321 3616729', href: 'tel:+923213616729' }
    ],
    email: 'qureshicompassionatealliance@gmail.com',
    emailHref: 'mailto:qureshicompassionatealliance@gmail.com',
    officeLine1: 'Chamber Zulqarnain Qureshi',
    officeLine2: 'District Courts, Sargodha',
    ublAccount: 'PK75UNIL0109000329837675',
    ublTitle: 'Qureshi Compassionate Alliance',
    jazzAccount: '03040571588',
    jazzHolder: 'Muhammad Zulqafil Hashmi',
    socialTikTok: '@compassionate_alliance',
    socialFacebookLabel: 'Compassionate Alliance',
    socialFacebookHref: 'https://www.facebook.com/share/172tA4Yg1K/?mibextid=wwXIfr',
    socialYoutube: '@CompassionateAllianceQURESHIFA',
    socialInstagram: 'compassionate.alliance'
  },

  footer: {
    about:
      'Dedicated to providing compassionate support to Qureshi families during their most difficult times. We believe that no family should face the burden of sudden loss alone.',
    phones: [
      { label: '+92 300 0797941', href: 'tel:+923000797941' },
      { label: '+92 300 6014081', href: 'tel:+923006014081' },
      { label: '+92 321 3616729', href: 'tel:+923213616729' }
    ],
    email: 'qureshicompassionatealliance@gmail.com',
    emailHref: 'mailto:qureshicompassionatealliance@gmail.com',
    address: 'Chamber Zulqarnain Qureshi, District Courts, Sargodha'
  }
};

module.exports = { DEFAULT_SITE_SECTIONS };
