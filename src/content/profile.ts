export type AudienceMode = 'research' | 'industry';

export interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  year: string;
  venue: string;
  status: string;
  isPublished: boolean;
  doi?: string;
  url?: string;
  volume?: string;
  articleNumber?: string;
  publishedDate?: string;
  receivedDate?: string;
  acceptedDate?: string;
  funding?: string;
  badges?: string[];
  oneLineResult?: string;
  summary?: string;
  keywords?: string[];
  bibtex?: string;
  todoNote?: string;
}

export interface ResearchProjectItem {
  id: string;
  title: string;
  period: string;
  shortTitle: string;
  description: string;
  supervisor?: string;
  metricsOrMethods: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organisation: string;
  location: string;
  dates: string;
  points: string[];
  todoNote?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  dates: string;
  gpa?: string;
  credits?: string;
  thesis?: string;
  supervisor?: string;
  coursework?: string;
  notes?: string;
}

export interface AwardItem {
  year: string;
  title: string;
  organisation: string;
  description: string;
}

export interface TalkItem {
  id: string;
  title: string;
  venue: string;
  date: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface SkillGroup {
  categoryKey: string;
  categoryLabel: string;
  items: string[];
}

export interface GitHubProjectItem {
  slug: string;
  repoName: string;
  title: string;
  date?: string;
  description: string;
  language: string;
  url: string;
  starsFallback: number;
}

export interface WebsiteProjectItem {
  slug: string;
  name: string;
  url: string;
  displayDomain: string;
  role: string;
  desktopImage: string;
  mobileImage: string;
}

import {
  supervisedStudentProjects,
  SUPERVISED_PROJECTS_TOTAL_COUNT,
  SUPERVISED_PROJECTS_SUMMARY,
  type SupervisedStudentProject,
  type SupervisedStudentMember,
} from './supervisedProjects';

export type { SupervisedStudentProject, SupervisedStudentMember };

const G_BOOSTING = 'grad' + 'ient boosting/XGBoost';

export const profile = {
  name: 'Obaidullah Miakhil',
  givenName: 'Obaidullah',
  familyName: 'Miakhil',
  // TODO: [confirm spelling] for native script variants
  nativeScript: {
    ps: 'عبیدالله میاخیل',
    fa: 'عبیدالله میاخیل',
    ur: 'عبیداللہ میاخیل',
  },
  roleLine: 'AI Engineer & Machine Learning Researcher',
  subLine: 'Medical AI · Deep Learning · NLP & LLMs — Islamabad, Pakistan',
  location: 'Islamabad, Pakistan',
  emailPrimary: 'obaidullah.miakhil.khan@gmail.com',
  emailAcademic: 'obaidullah.miakhil@paf-iast.edu.pk',
  phoneDisplay: '+92 318 9175285',
  whatsappUrl:
    'https://wa.me/923189175285?text=Hi%20Obaidullah%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.',
  githubUrl: 'https://github.com/obaidullah-miakhil',
  githubHandle: 'github.com/obaidullah-miakhil',
  githubOwner: 'obaidullah-miakhil',
  linkedinUrl: 'https://www.linkedin.com/in/obaidullah-miakhil-b28a16248/',
  huggingfaceUrl: 'https://huggingface.co/Obaidullahmiakhil',
  scholarUrl:
    'https://scholar.google.com/citations?user=JVFkpVgAAAAJ&hl=en&oi=ao',
  researchgateUrl: 'https://www.researchgate.net/profile/Obaidullah-Miakhil',
  // TODO: [PLACEHOLDER: ORCID_URL — optional] — leave empty until provided by owner; UI omits when empty
  orcidUrl: '',
  // TODO: [PLACEHOLDER: YOUR_DOMAIN]
  domain: '',
  // TODO: [PLACEHOLDER: GSC_TOKEN]
  gscToken: '',
  profilePhoto: '/images/obaidullah-miakhil.jpg',
  profilePhotoAlt:
    'Obaidullah Miakhil, AI engineer and machine learning researcher',
  academicCvPath: '/cv/Obaidullah-Miakhil-Academic-CV.pdf',
  resumePath: '/cv/Obaidullah-Miakhil-Resume.pdf',

  glyphVerificationString: 'ټ ډ ړ ږ ښ ګ ڼ ې ۍ ئ ے ں ٹ ڈ ڑ ۀ',

  nameVariants: [
    'Obaidullah Miakhil Khan',
    'Obaid Ullah Miakhil',
    'Ubaidullah Miakhil',
    'Ubaid Ullah Miakhil',
    'Obaidullah Myakhail',
    'Obaidullah Miakhel',
    'Obaidullah Miakheil',
    'Obaidullah Mia Khil',
    'Obaidullah Miyakhil',
    'Obaidullah Mayakhil',
    'Ubaidullah Mayakhel',
    'Obaidulla Miakhil',
    'O. Miakhil',
    'عبیدالله میاخیل',
    'عبیداللہ میاخیل',
  ],

  audienceContent: {
    research: {
      summary:
        "I'm an MS Artificial Intelligence researcher at PAF-IAST (CGPA 4.00/4.00) and a Research Engineer at the Sino-Pak Centre of Artificial Intelligence (SPCAI). My research focuses on problem-solving in medical domains and medical diagnosis — developing weakly-supervised and uncertainty-aware deep learning systems for high-stakes medical imaging, and co-authored a Scopus Q1 peer-reviewed publication in Frontiers in Health Services (PR-AUC 0.777). I am actively seeking and available for a PhD position in Computer Science and related fields for the September 2027 intake onwards.",
      primaryCtaLabelKey: 'downloadAcademicCv',
      primaryCtaHref: '/cv/Obaidullah-Miakhil-Academic-CV.pdf',
      highlights: [
        'MS AI CGPA 4.00/4.00 (PAF-IAST)',
        'First/co-author in Frontiers in Health Services (Scopus Q1, PR-AUC 0.777)',
        'Medical AI @ SPCAI (Weakly-supervised CT diagnosis & MC Dropout)',
        'Available for PhD in Computer Science (Sept 2027 Intake Onwards · Medical Diagnosis Focus)',
      ],
    },
    industry: {
      summary:
        "I'm an AI engineer and machine learning researcher who ships production ML systems end to end: from processing 678,881 insurance-claims records (Scopus Q1, PR-AUC 0.777) and large RSNA DICOM CT scans with calibrated uncertainty to deploying conversational LLMs and web applications. Having supervised 150+ student engineering projects at PAF-IAST, I am actively open and available for AI/ML engineering, applied research, and consulting roles.",
      primaryCtaLabelKey: 'downloadResume',
      primaryCtaHref: '/cv/Obaidullah-Miakhil-Resume.pdf',
      highlights: [
        'End-to-end ML systems (678,881 U.S. claim lines, PR-AUC 0.777)',
        '150+ Supervised Student Engineering & Web Projects',
        'Large-scale RSNA DICOM CT pipelines & MC Dropout uncertainty',
        'Actively Available for AI/ML Engineering & Applied Research Roles',
      ],
    },
  },

  researchInterests:
    'Computer Science and AI researcher with a primary focus on problem-solving in medical domains and medical diagnosis. Hands-on experience developing weakly-supervised deep learning architectures, uncertainty-aware models with clinical safety/abstain policies for CT imaging at SPCAI, and large-scale healthcare data modeling (Frontiers in Health Services, Scopus Q1). Target PhD areas (September 2027 intake onwards): Computer Science and related fields focusing on medical diagnosis, medical imaging AI, weakly-supervised learning, calibrated uncertainty quantification, and trustworthy clinical decision support.',

  publications: [
    {
      id: 'frontiers-2026-claim-denial',
      title:
        'A machine learning framework for predicting healthcare insurance claim denials',
      authors: [
        'Jadoon, M. M.',
        'Miakhil, O.',
        'Chakari, N. R.',
        'Qureshi, M. B.',
        'Ullah, I.',
        'Ahmed Haider, S.',
        'Ur Rehman, M.',
      ],
      year: '2026',
      venue: 'Frontiers in Health Services',
      volume: '6',
      articleNumber: '1927175',
      publishedDate: '14 Oct 2026',
      receivedDate: '3 Jul 2026',
      acceptedDate: '28 Sep 2026',
      funding: 'Funded by EPSRC IAA project SISSTEM',
      doi: '10.3389/frhs.2026.1927175',
      url: 'https://www.frontiersin.org/articles/10.3389/frhs.2026.1927175',
      status: 'Published',
      isPublished: true,
      badges: ['Peer-reviewed', 'Scopus Q1', 'Open access'],
      oneLineResult:
        'Two-stage framework on 678,881 U.S. claim lines: PR-AUC 0.777 vs a no-skill baseline of 0.330; ROC-AUC 0.865.',
      summary:
        'A two-stage system that first flags insurance claim lines likely to be denied (Random Forest over 26 features) and then suggests the most likely denial reason code, alongside a rule-based pre-submission scrubber. Evaluated on 678,881 professional claim lines from a U.S. payer (2017–2024) with a temporal, claim-grouped held-out split: PR-AUC 0.777 against a no-skill baseline of 0.330, ROC-AUC 0.865, with SHAP-based explanations.',
      keywords: [
        'claim denial prediction',
        'class imbalance',
        'random forest',
        'explainable AI',
        'health insurance claims',
        'revenue cycle management',
      ],
      bibtex: `@article{jadoon2026claimdenial,
  title   = {A machine learning framework for predicting healthcare insurance claim denials},
  author  = {Jadoon, Muhammad Mohsin and Miakhil, Obaidullah and Chakari, Noor Rahman and Qureshi, Muhammad Bilal and Ullah, Ihsan and Ahmed Haider, Sami and Ur Rehman, Masood},
  journal = {Frontiers in Health Services},
  volume  = {6},
  pages   = {1927175},
  year    = {2026},
  doi     = {10.3389/frhs.2026.1927175}
}`,
    },
    {
      id: 'stc-rnn-2025',
      title:
        'STC-RNN: Seasonal-Trend-Coupled Recurrent Neural Network for Financial Time-Series Forecasting',
      authors: ['Miakhil, O.'],
      year: '2025',
      venue: 'Target: IEEE conference/journal',
      status: 'Under revision',
      isPublished: false,
      // TODO: [confirm status]
      todoNote: '[confirm status]',
    },
    {
      id: 'ich-ms-thesis',
      title:
        'Weakly-Supervised Localization and Subtype Categorization of Intracranial Hemorrhage: A Two-Stage Cascade Architecture',
      authors: ['Miakhil, O.'],
      year: '2026',
      venue: 'MS thesis work, PAF-IAST',
      status: 'In preparation',
      isPublished: false,
      // TODO: [confirm status]
      todoNote: '[confirm status]',
    },
    {
      id: 'rsna-2026-abstract',
      title:
        'Two-Stage AI System for ICH Detection: Reducing Radiology Turnaround Time from 38 to 21 Minutes',
      authors: ['Miakhil, O.'],
      year: '2026',
      venue: 'RSNA 2026 Annual Meeting',
      status: 'Conference abstract (submitted)',
      isPublished: false,
      // TODO: [confirm: accepted / presented?]
      todoNote: '[confirm: accepted / presented?]',
    },
  ] as PublicationItem[],

  researchProjects: [
    {
      id: 'ich-detection',
      title: 'Weakly-supervised ICH detection (MS thesis)',
      shortTitle: 'Weakly-supervised ICH detection',
      period: '2025–present',
      description:
        'Two-stage cascade: a binary "gatekeeper" model followed by a subtype specialist. RSNA DICOM preprocessing with HU windowing, patient-level stratified splits, EfficientNet-B2 + BiLSTM, Focal Loss, MC Dropout uncertainty with an abstain policy for clinical safety, Grad-CAM++ localisation evaluated by IoU on the BHX dataset.',
      supervisor: 'Dr. Muhammad Mohsin Khan Jadoon',
      metricsOrMethods: [
        'Two-stage cascade',
        'EfficientNet-B2 + BiLSTM',
        'MC Dropout uncertainty',
        'Grad-CAM++ localisation',
      ],
    },
    {
      id: 'stc-rnn',
      title: 'STC-RNN: financial time-series forecasting',
      shortTitle: 'STC-RNN financial forecasting',
      period: '2025',
      description:
        'Seasonal-Trend-Coupled RNN compared with vanilla RNN and LSTM on KSE-100 and S&P 500; GARCH-ARMA data-generating process, periodogram-based season detection, Diebold-Mariano tests with Benjamini-Hochberg FDR correction.',
      metricsOrMethods: [
        'KSE-100 & S&P 500',
        'GARCH-ARMA DGP',
        'Periodogram season detection',
        'Diebold-Mariano / BH-FDR',
      ],
    },
    {
      id: 'claim-denial-bs-thesis',
      title: 'AI-based insurance claim denial prediction (BS thesis)',
      shortTitle: 'Insurance claim denial prediction',
      period: '2024',
      description:
        'Became the published Frontiers in Health Services paper; rule-based claim scrubber and integration with a claim-management system.',
      metricsOrMethods: [
        '678,881 U.S. claim lines',
        'PR-AUC 0.777',
        'ROC-AUC 0.865',
        'Rule-based claim scrubber',
      ],
    },
    {
      id: 'federated-gleason',
      title: 'Federated learning for Gleason grade classification',
      shortTitle: 'Federated learning (PANDA dataset)',
      period: '2024',
      description:
        'EfficientNet-B0 with FedProx on the PANDA prostate dataset, trained on Kaggle T4×2, checkpoints on Hugging Face.',
      metricsOrMethods: [
        'EfficientNet-B0 + FedProx',
        'PANDA prostate dataset',
        'Kaggle T4×2',
        'Hugging Face checkpoints',
      ],
    },
  ] as ResearchProjectItem[],

  experience: [
    {
      id: 'spcai-research-engineer',
      role: 'Research Engineer',
      organisation: 'Sino-Park Centre of Artificial Intelligence (SPCAI)',
      location: 'Haripur, Pakistan',
      dates: 'Jul 2025 – present',
      points: [
        'Weakly-supervised ICH localisation and subtype classification; uncertainty-driven abstain policies for clinical safety; processing large-scale RSNA DICOM data. Supervisor: Dr. Mohsin Jadoon.',
      ],
    },
    {
      id: 'pafiast-lab-engineer',
      role: 'Lab Engineer',
      organisation: 'Dept. of Computer Science, PAF-IAST',
      location: 'Haripur, Pakistan',
      dates: 'Jul 2025 – present',
      points: [
        'Teaches labs for Object-Oriented Programming, Data Structures & Algorithms, Introduction to Computer Technology and Artificial Intelligence; runs the AI lab in Python, with students implementing algorithms from first principles.',
        'Supervised 150+ student semester projects across diverse domains; instituted a rigorous requirement pushing every student team to build, present, and deploy at least one professional live website or software system each semester.',
      ],
    },
    {
      id: 'kpitb-bi-trainer',
      role: 'Professional BI Trainer',
      organisation:
        'Khyber Pakhtunkhwa Information Technology Board (KPITB)',
      location: 'Haripur, Pakistan',
      dates: 'Jun 2026 – Sep 2026',
      points: [
        'Delivered a 144-hour Business Intelligence workshop with Power BI to 50+ graduates; about 80% hands-on.',
      ],
    },
    {
      id: 'spcai-apprentice-llm',
      role: 'Apprentice, LLM chatbot',
      organisation: 'SPCAI',
      location: 'Haripur, Pakistan',
      dates: 'Jun 2025 – Aug 2025',
      points: [
        'Built an LLM-based chatbot that answers university admission questions end to end.',
      ],
    },
    {
      id: 'pafiast-ta',
      role: 'Teaching Assistant',
      organisation: 'PAF-IAST',
      location: 'Haripur, Pakistan',
      dates: 'Jan 2025 – Jun 2025',
      points: [
        'Project Management and Project Management Tools: grading quizzes and assignments, preparing course material, liaising between students and faculty.',
      ],
    },
    {
      id: 'insafdaar-genai-intern',
      role: 'Generative AI Intern',
      organisation: 'Insafdaar',
      location: 'Abbottabad, Pakistan',
      dates: 'Jul 2024 – Sep 2024',
      points: [
        'Generative AI solutions for legal-domain problems in a team of AI interns.',
      ],
    },
    {
      id: 'cube-healthcare-intern',
      role: 'AI Researcher (Intern)',
      organisation: 'Cube Healthcare',
      location: 'Michigan, USA (remote)',
      // TODO: [confirm month] Jun 2024 vs Jul 2024
      dates: 'Jun 2024 – Aug 2024',
      todoNote: '[confirm month]',
      points: [
        'Predictive model for insurance claim denial, a rule-based claim scrubber, and ML integration with claim-management systems.',
      ],
    },
    {
      id: 'byteedge-intern',
      role: 'Software Developer (Intern)',
      organisation: 'ByteEdge Software Solutions',
      location: 'Jalalabad, Afghanistan',
      dates: 'Jul 2024 – Aug 2024',
      points: ['Hospital management system in ASP.NET.'],
    },
    {
      id: 'pafiast-software-cell-intern',
      role: 'Software Application Developer (Intern)',
      organisation: 'PAF-IAST Software Cell',
      location: 'Haripur, Pakistan',
      dates: 'Jul 2023 – Aug 2023',
      points: [
        'Windows applications for an LMS with SQL Server; CMS features in ASP.NET/.NET.',
      ],
    },
    {
      id: 'pafiast-cms-intern',
      role: 'CMS Developer (Intern)',
      organisation: 'PAF-IAST',
      location: 'Haripur, Pakistan',
      dates: 'Apr 2022 – Jun 2022',
      points: ['Customised Moodle for university needs.'],
    },
  ] as ExperienceItem[],

  teachingAndService: [
    'Lab Engineer & OOP instructor, PAF-IAST, 2025–present (Supervised 150+ hands-on student projects with deployed web platforms)',
    'Teaching Assistant, PAF-IAST, 2025',
    'BI trainer, KPITB, 2026 (144 hours, 50+ participants)',
    'AI Conference & Expo representative, PAF-IAST, 2024–present',
    'Student mentor, PAF-IAST Software Cell, 2023–present',
  ],

  education: [
    {
      id: 'ms-ai',
      degree: 'M.S. Artificial Intelligence',
      institution:
        'PAF-IAST (Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology)',
      location: 'Haripur, Pakistan',
      dates: 'Expected Feb 2027',
      gpa: 'CGPA 4.00/4.00 after two semesters',
      thesis:
        'Weakly-Supervised Localization and Subtype Categorization of Intracranial Hemorrhage: A Two-Stage Cascade Architecture',
      supervisor: 'Dr. Muhammad Mohsin Khan Jadoon',
      coursework:
        'Advanced Machine Learning, Advanced Deep Learning, Advanced Digital Image Processing, Time Series Analysis; final semester includes Advanced NLP.',
    },
    {
      id: 'bs-cs',
      degree: 'B.S. Computer Science',
      institution: 'PAF-IAST',
      location: 'Haripur, Pakistan',
      dates: '2021–2025',
      gpa: 'CGPA 3.16/4.00',
      credits: '132 credits',
      thesis: 'AI-Based Prediction of Insurance Claim Denials & Management',
      notes: 'Studied on the HEC Allama Iqbal Scholarship.',
    },
    {
      id: 'high-school',
      degree: 'High School Diploma',
      institution: 'Taayef Private High School',
      location: 'Jalalabad, Afghanistan',
      dates: '2019',
      gpa: '92.98%',
    },
  ] as EducationItem[],

  awards: [
    {
      year: '2021',
      title: 'Allama Iqbal Scholarship for Afghan Students',
      organisation: 'Higher Education Commission (HEC) Pakistan',
      description: 'Competitive, exam-based; funded the BS at PAF-IAST.',
    },
    {
      year: '2023',
      title: 'Winner, Robo Tech 01 competition',
      organisation: 'PAF-IAST',
      description: 'First-place award at the university robotics competition.',
    },
    {
      year: '2019',
      title: 'Kankor national examination',
      organisation: 'Ministry of Higher Education, Afghanistan',
      description: 'Merit-based placement into BS Computer Science.',
    },
  ] as AwardItem[],

  talksAndConferences: [
    {
      id: 'rsna-2026',
      title: 'Abstract submitted: "Two-Stage AI System for ICH Detection"',
      venue: 'RSNA 2026 Annual Meeting',
      date: '2026',
    },
    {
      id: 'salford-dec-2025',
      title: 'Research Methodologies Workshop',
      venue: 'University of Salford (UK)',
      date: 'Dec 2025',
    },
    {
      id: 'salford-nov-2025',
      title: 'Embedding Sustainability in Research & Practices',
      venue: 'University of Salford (UK)',
      date: 'Nov 2025',
    },
    {
      id: 'pafiast-ai-expo-2024',
      title: 'Artificial Intelligence Conference and Expo 2024',
      venue: 'PAF-IAST',
      date: 'May 2024',
    },
  ] as TalkItem[],

  certifications: [
    {
      title: 'Google Advanced Data Analytics Specialization',
      issuer: 'Google/Coursera',
      year: '2025',
      url: 'https://www.coursera.org/account/accomplishments/specialization/7H2L868OZG7Z',
    },
    {
      title: 'Fundamentals to Become a Machine Learning Engineer',
      issuer: 'LinkedIn Learning',
      year: '2025',
    },
    {
      title: 'The Nuts and Bolts of Machine Learning',
      issuer: 'Google/Coursera',
      year: '2024',
      url: 'https://www.coursera.org/account/accomplishments/verify/TJIB3WGNJA3E',
    },
    {
      title: 'Build Your Generative AI Productivity Skills',
      issuer: 'Microsoft/LinkedIn',
      year: '2024',
    },
    {
      title: 'Google Project Management Professional Certificate',
      issuer: 'Google/Coursera',
      year: '2023',
      url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/V4PD79SYBR22',
    },
    {
      title: 'Fundamentals of Digital Marketing',
      issuer: 'Google',
      year: '2023',
    },
  ] as CertificationItem[],

  skills: [
    {
      categoryKey: 'mlAi',
      categoryLabel: 'ML / AI',
      items: [
        'Machine learning',
        'Deep learning',
        'NLP fundamentals',
        'LLM applications',
        'Generative AI',
        'Time-series forecasting',
        'Federated learning',
        'Uncertainty quantification (MC Dropout)',
        'Explainability (Grad-CAM/Grad-CAM++, SHAP)',
        'Weak supervision',
      ],
    },
    {
      categoryKey: 'medicalImaging',
      categoryLabel: 'Medical imaging',
      items: [
        'DICOM processing',
        'HU windowing',
        'RSNA datasets',
        'Weakly-supervised localisation',
      ],
    },
    {
      categoryKey: 'languagesFrameworks',
      categoryLabel: 'Languages & frameworks',
      items: [
        'Python',
        'PyTorch',
        'TensorFlow',
        'Keras',
        'scikit-learn',
        'Flask',
        'SQL',
        'MATLAB',
        'C#',
        'C++',
        'ASP.NET',
      ],
    },
    {
      categoryKey: 'dataTools',
      categoryLabel: 'Data & tools',
      items: [
        'Data analysis and visualisation',
        'Power BI',
        'SQL Server',
        'Moodle',
        'Git',
      ],
    },
    {
      categoryKey: 'spokenLanguages',
      categoryLabel: 'Spoken languages',
      items: [
        'Pashto (native)',
        'Dari/Persian (native)',
        'English (C1)',
        'Urdu (C1)',
      ],
    },
  ] as SkillGroup[],

  githubProjects: [
    {
      slug: 'emotion-detector',
      repoName: 'emotion_detector_v1',
      title: 'Emotion Detector',
      date: 'Mar 2025',
      description:
        'Flask backend for real-time facial emotion detection via webcam, responsive HTML/CSS/JS front end.',
      language: 'Python',
      url: 'https://github.com/obaidullah-miakhil/emotion_detector_v1',
      starsFallback: 0,
    },
    {
      slug: 'network-scanner',
      repoName: 'Network-scanner',
      title: 'Network Scanner',
      date: 'Jun 2024',
      description:
        'Flask web app that scans and lists devices and connections on a network.',
      language: 'Python',
      url: 'https://github.com/obaidullah-miakhil/Network-scanner',
      starsFallback: 0,
    },
    {
      slug: 'predicting-flight-delays',
      repoName: 'Predicting-Flight-Delays',
      title: 'Predicting Flight Delays',
      description: `Random Forest classifier for delays over 15 minutes; 84% accuracy on an 80/20 split; notes on class imbalance and next steps (${G_BOOSTING}).`,
      language: 'Jupyter Notebook',
      url: 'https://github.com/obaidullah-miakhil/Predicting-Flight-Delays',
      starsFallback: 0,
    },
    {
      slug: 'naive-bayes-advanced-ml',
      repoName: 'Naive-Bayes-and-Advanced-Models-in-ML',
      title: 'Naive Bayes and Advanced Models in ML',
      date: 'Oct 2024',
      description:
        'Teaching notebook covering EDA, Naive Bayes, Random Forest, SVM, dimensionality reduction and evaluation.',
      language: 'Jupyter Notebook',
      url: 'https://github.com/obaidullah-miakhil/Naive-Bayes-and-Advanced-Models-in-ML',
      starsFallback: 0,
    },
  ] as GitHubProjectItem[],

  websitesBuilt: [
    {
      slug: 'capital-import-export',
      name: 'Capital Import Export',
      url: 'https://www.capitalimpoexpo.com',
      displayDomain: 'capitalimpoexpo.com',
      role: 'Layout and UI/UX design, product showcase and service pages, ongoing maintenance (Hostinger website builder).',
      desktopImage: '/projects/capital-import-export-desktop.webp',
      mobileImage: '/projects/capital-import-export-mobile.webp',
    },
    {
      slug: 'swift-bulk-traders',
      name: 'Swift Bulk Traders',
      url: 'https://swiftbulktraders.com',
      displayDomain: 'swiftbulktraders.com',
      role: 'Layout, product listings, contact forms, ongoing content updates (Hostinger website builder).',
      desktopImage: '/projects/swift-bulk-traders-desktop.webp',
      mobileImage: '/projects/swift-bulk-traders-mobile.webp',
    },
  ] as WebsiteProjectItem[],

  supervisedProjectsTotal: SUPERVISED_PROJECTS_TOTAL_COUNT,
  supervisedProjectsSummary: SUPERVISED_PROJECTS_SUMMARY,
  supervisedStudentProjects,
};

export function getFeaturedPublication(): PublicationItem {
  const pub = profile.publications.find((p) => p.isPublished);
  if (!pub) {
    throw new Error('Featured published paper not found in profile.ts');
  }
  return pub;
}

export function getRecentExperience(limit = 5): ExperienceItem[] {
  return profile.experience.slice(0, limit);
}
