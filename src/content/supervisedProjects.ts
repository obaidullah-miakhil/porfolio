export interface SupervisedStudentMember {
  name: string;
  studentId: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface SupervisedStudentProject {
  id: string;
  groupNumber: number;
  groupLabel: string;
  projectName: string;
  course: string;
  semester: string;
  isPublished: boolean;
  liveUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  description: string;
  members: SupervisedStudentMember[];
}

export const SUPERVISED_PROJECTS_TOTAL_COUNT = '150+';
export const SUPERVISED_PROJECTS_SUMMARY =
  'In my teaching experience, I push my students to build and deploy at least one professional, production-ready website or system each semester. Through this hands-on pedagogy, I have supervised 150+ student projects solving diverse real-world problems. Below is a curated cohort of student projects from the Object-Oriented Programming & Software Design lab at PAF-IAST, featuring deployed online applications at the top followed by complete team repositories and professional LinkedIn demonstrations.';

// Featured cohort from PAF-IAST OOP & Software Lab, ordered with published/live websites at top
export const supervisedStudentProjects: SupervisedStudentProject[] = [
  // 1. Simple Git (Live Deployed)
  {
    id: 'group-1-simple-git',
    groupNumber: 1,
    groupLabel: 'Group 1',
    projectName: 'Simple Git',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://razamindset.github.io/simplegit/',
    githubUrl: 'https://github.com/Razamindset/simplegit/',
    linkedinUrl:
      'https://www.linkedin.com/posts/razamindset_python-pyqt6-oop-ugcPost-7469801609221271553-BuHR/',
    description:
      'A beginner-friendly desktop & web Git GUI application built with Python & PyQt6, enabling visual commit graphs and intuitive version control.',
    members: [
      {
        name: 'Ali Raza Khalid',
        studentId: 'B25F0090AI160',
        githubUrl: 'https://github.com/Razamindset/simplegit/',
        linkedinUrl:
          'https://www.linkedin.com/posts/razamindset_python-pyqt6-oop-ugcPost-7469801609221271553-BuHR/',
      },
      {
        name: 'Fiza Batool',
        studentId: 'B25F0392AI224',
        githubUrl: 'https://github.com/writerfiza/simplegit.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/writerfiza-088b17400_we-built-simplegit-a-beginner-friendly-activity-7469813179200495616-d-3p',
      },
      {
        name: 'Mahnoor Ali',
        studentId: 'B25F0493AI134',
        githubUrl: 'https://github.com/cadetmahnoorali/simplegit.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/mahnoor-ali-238550404_introducing-simplegit-a-desktop-application-activity-7469818036410048514-IZOZ',
      },
    ],
  },

  // 2. CampusTrace Web (Live Deployed)
  {
    id: 'group-2-campustrace',
    groupNumber: 2,
    groupLabel: 'Group 2',
    projectName: 'CampusTrace Web',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'http://campustrace-web.vercel.app/',
    githubUrl: 'https://github.com/alisufiankhan/CampusTraceWeb',
    linkedinUrl:
      'https://www.linkedin.com/feed/update/urn:li:activity:7469791157812748288/',
    description:
      'A comprehensive university lost-and-found tracking web platform with integrated C++ undo/redo engine and data structures.',
    members: [
      {
        name: 'Ali Sufian',
        studentId: 'B25F0559AI154',
        githubUrl: 'https://github.com/alisufiankhan/CampusTraceWeb',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:activity:7469791157812748288/',
      },
      {
        name: 'Amina Shafiq',
        studentId: 'B25F2267AI157',
        githubUrl: 'https://github.com/awanamna233-dev/CampusTraceWeb',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:activity:7470543847190736896/',
      },
      {
        name: 'Umama Khurram',
        studentId: 'B25F2677AI147',
        githubUrl: 'https://github.com/umamakhurram/campustraceweb',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:activity:7469799543916875776/',
      },
      {
        name: 'Muneeb Gulistan',
        studentId: 'B25F0326AI153',
        githubUrl: 'https://github.com/Muneebgulistan/Undo_redo_Engine-',
        linkedinUrl:
          'https://www.linkedin.com/posts/muneeb-gulistan_oop-cpp-datastructures-activity-7469762995452301313-cn38',
      },
    ],
  },

  // 3. Saif Shell (Live Deployed)
  {
    id: 'group-5-saif-shell',
    groupNumber: 5,
    groupLabel: 'Group 5',
    projectName: 'Saif Shell',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://saifshell.netlify.app/',
    githubUrl: 'https://github.com/Saifqureshi90555/Saif-Shell',
    linkedinUrl:
      'https://www.linkedin.com/posts/saif-abid-8171bb361_cplusplus-webassembly-threejs-ugcPost-7469344474431754241-j5mf/',
    description:
      'An interactive in-browser Unix-like command shell compiled from C++ via WebAssembly with Three.js graphics.',
    members: [
      {
        name: 'Saif Ullah Abid',
        studentId: 'B25F0590AI135',
        githubUrl: 'https://github.com/Saifqureshi90555/Saif-Shell',
        linkedinUrl:
          'https://www.linkedin.com/posts/saif-abid-8171bb361_cplusplus-webassembly-threejs-ugcPost-7469344474431754241-j5mf/',
      },
    ],
  },

  // 4. Clinic Web (Live Deployed)
  {
    id: 'group-6-clinic-web',
    groupNumber: 6,
    groupLabel: 'Group 6',
    projectName: 'PAF-IAST Clinic Management Web',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://paf-iast-clinic-management-system.netlify.app/',
    githubUrl: 'https://github.com/Hashir-rgb/paf-iast-clinic-management-system',
    linkedinUrl:
      'https://www.linkedin.com/posts/hashir-rehman-61b1ab388_webdevelopment-clinicmanagementsystem-healthcaretech-share-7469406278587441154-t0Ng/',
    description:
      'A healthcare web application for university clinic patient records, appointments, doctor scheduling, and inventory tracking.',
    members: [
      {
        name: 'Hashir Rehman',
        studentId: 'B25F0351AI129',
        githubUrl:
          'https://github.com/Hashir-rgb/paf-iast-clinic-management-system',
        linkedinUrl:
          'https://www.linkedin.com/posts/hashir-rehman-61b1ab388_webdevelopment-clinicmanagementsystem-healthcaretech-share-7469406278587441154-t0Ng/',
      },
      {
        name: 'Mujtaba Ahmad',
        studentId: 'B25F0183AI139',
        githubUrl: 'https://github.com/mujtabaahmed6934-lgtm/clinic',
        linkedinUrl:
          'https://www.linkedin.com/posts/mujtaba-ahmad-0993b7357_webdevelopment-clinicmanagementsystem-softwareengineering-ugcPost-7469419213556834304-ztMk/',
      },
    ],
  },

  // 5. Smart Campus Transport System (Live Deployed)
  {
    id: 'group-8-smart-campus-transport',
    groupNumber: 8,
    groupLabel: 'Group 8',
    projectName: 'Smart Campus Transport System',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://smartcampustransportsystem.netlify.app/',
    githubUrl: 'https://github.com/Arkhan-max/Smart-Campus-Transport-System',
    linkedinUrl:
      'https://www.linkedin.com/posts/abdul-rahman-aamer-77a8843b6_smartcampustransport-semesterproject-softwaredevelopment-activity-7469060761492058112-Iy1e',
    description:
      'Smart bus scheduling, vehicle fleet telemetry, route optimization, and student ride tracking system for university campuses.',
    members: [
      {
        name: 'Abdul Rahman Aamer',
        studentId: 'B25F1370AI124',
        githubUrl: 'https://github.com/Arkhan-max/Smart-Campus-Transport-System',
        linkedinUrl:
          'https://www.linkedin.com/posts/abdul-rahman-aamer-77a8843b6_smartcampustransport-semesterproject-softwaredevelopment-activity-7469060761492058112-Iy1e',
      },
      {
        name: 'Zohaib Gul',
        studentId: 'B25F1608AI148',
        githubUrl: 'https://github.com/ZohaibGuk/Smart-Campus-Transport-System',
        linkedinUrl:
          'https://www.linkedin.com/posts/zohaib-gul-102420300_smartcampustransport-semesterproject-softwaredevelopment-share-7469045106050867200-VACO/',
      },
      {
        name: 'Daim Ali Abbasi',
        studentId: 'B25F0571AI113',
      },
    ],
  },

  // 6. Hostel Management System (Live Deployed)
  {
    id: 'group-9-hostel-management',
    groupNumber: 9,
    groupLabel: 'Group 9',
    projectName: 'Hostel Management System',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://hostelmangement-muhammadsadeeqcodes.netlify.app/',
    githubUrl:
      'https://github.com/MuhammadSadeeq357/https-hostelmangement-muhammadsadeeqcodes.netlify.app-',
    linkedinUrl:
      'https://www.linkedin.com/feed/update/urn:li:share:7469813028369162240/',
    description:
      'Room allotment, resident portal, mess billing, and maintenance complaint tracking built with object-oriented software design.',
    members: [
      {
        name: 'Muhammad Sadeeq',
        studentId: 'B25F2094AI162',
        githubUrl:
          'https://github.com/MuhammadSadeeq357/https-hostelmangement-muhammadsadeeqcodes.netlify.app-',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:share:7469813028369162240/',
      },
      {
        name: 'Ubaid Ullah',
        studentId: 'B25F2029AI136',
        githubUrl:
          'https://github.com/ubaidullahkhan0369/Hostal-Managment-System..git',
        linkedinUrl:
          'https://www.linkedin.com/posts/ubaid-ullah-9a6004384_oop-cplusplus-softwaredevelopment-share-7469822504874778625-c5PB/',
      },
      {
        name: 'Sudais Ahmad',
        studentId: 'B25F2685AI127',
        githubUrl:
          'https://github.com/sudaismuhammad4321-arch/Hostel-Managment-System..git',
        linkedinUrl:
          'https://www.linkedin.com/posts/sudais-ahmad-44086b406_oop-cplusplus-softwaredevelopment-share-7469821486753763329-KlPQ/',
      },
    ],
  },

  // 7. Electricity Bill Tracker (Live Deployed)
  {
    id: 'group-15-electricity-bill-tracker',
    groupNumber: 15,
    groupLabel: 'Group 15',
    projectName: 'Electricity Bill Tracker',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://project-cppp.netlify.app/',
    githubUrl: 'https://github.com/Theprogramerz/project.git',
    linkedinUrl:
      'https://www.linkedin.com/posts/abdullah-waheed-a6a423395_oop-cplusplus-programming-share-7469811018811015169-xXwD/',
    description:
      'Utility billing calculation, unit slab tariff monitoring, and consumption forecasting tool implemented in C++ and deployed online.',
    members: [
      {
        name: 'Abdullah Waheed',
        studentId: 'B25F2200AI142',
        githubUrl: 'https://github.com/Theprogramerz/project.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/abdullah-waheed-a6a423395_oop-cplusplus-programming-share-7469811018811015169-xXwD/',
      },
    ],
  },

  // 8. CAMPUSRIDE / Scholar Drive (Live Deployed)
  {
    id: 'group-16-campusride',
    groupNumber: 16,
    groupLabel: 'Group 16',
    projectName: 'CAMPUSRIDE (Scholar Drive)',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: true,
    liveUrl: 'https://scholar-drive.netlify.app/',
    githubUrl: 'https://github.com/Fatimah-1231/campus-ride',
    linkedinUrl: 'https://tinyurl.com/3sw6wu73',
    description:
      'Peer-to-peer campus ride sharing and carpooling platform connecting verified students and faculty members with university email verification.',
    members: [
      {
        name: 'Fatima Ayub',
        studentId: 'B25F0311AI141',
        githubUrl: 'https://github.com/Fatimah-1231/campus-ride',
        linkedinUrl: 'https://tinyurl.com/3sw6wu73',
      },
      {
        name: 'Adan Shoukat',
        studentId: 'B25F1831AI150',
        githubUrl: 'https://github.com/Adanshoukat/campus-ride',
        linkedinUrl:
          'https://www.linkedin.com/posts/adan-shoukat-b5267b39a_webdevelopment-frontend-uiux-ugcPost-7469810000211783680-7s_U/',
      },
    ],
  },

  // 9. Ride Flow
  {
    id: 'group-3-ride-flow',
    groupNumber: 3,
    groupLabel: 'Group 3',
    projectName: 'Ride Flow',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl: 'https://github.com/abdullahmushtaq2007/rideflow',
    linkedinUrl:
      'https://www.linkedin.com/feed/update/urn:li:activity:7469975256041140224/',
    description:
      'Campus passenger dispatch and route optimization engine implemented with object-oriented design principles in C++.',
    members: [
      {
        name: 'Abdullah Mushtaq',
        studentId: 'B25F0951AI119',
        githubUrl: 'https://github.com/abdullahmushtaq2007/rideflow',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:activity:7469975256041140224/',
      },
    ],
  },

  // 10. C++ Encryption Tool
  {
    id: 'group-4-cpp-encryption-tool',
    groupNumber: 4,
    groupLabel: 'Group 4',
    projectName: 'C++ Encryption Tool',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl: 'https://github.com/MuneebUrRehman12/Cpp-encryptiontool',
    linkedinUrl:
      'https://www.linkedin.com/posts/muneeb-ur-rehman-0b0bb93ba_github-muneeburrehman12cpp-encryptiontool-share-7469451796441288704-6CWT/',
    description:
      'Cryptographic data encryption and secure file hashing utility implemented from scratch in modern C++.',
    members: [
      {
        name: 'Muneeb Ur Rehman',
        studentId: 'B25F2474AI138',
        githubUrl: 'https://github.com/MuneebUrRehman12/Cpp-encryptiontool',
        linkedinUrl:
          'https://www.linkedin.com/posts/muneeb-ur-rehman-0b0bb93ba_github-muneeburrehman12cpp-encryptiontool-share-7469451796441288704-6CWT/',
      },
      {
        name: 'Daniyal Ahmad',
        studentId: 'B25F2501AI132',
      },
    ],
  },

  // 11. Doner Deck
  {
    id: 'group-7-doner-deck',
    groupNumber: 7,
    groupLabel: 'Group 7',
    projectName: 'Doner Deck',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    linkedinUrl: 'https://www.linkedin.com/',
    description:
      'Digital blood donation registry, donor matching algorithm, and urgent emergency request management system.',
    members: [
      {
        name: 'Muhammad Bilal',
        studentId: 'B25F1627AI158',
      },
      {
        name: 'Saifullah Khan',
        studentId: 'B25F0655AI152',
        linkedinUrl: 'https://www.linkedin.com/',
      },
    ],
  },

  // 12. Cipher DNA (Security Portal)
  {
    id: 'group-10-cipher-dna',
    groupNumber: 10,
    groupLabel: 'Group 10',
    projectName: 'Cipher DNA (Security Portal)',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl: 'https://github.com/HADIA-ISLAM-543/CipherDNA-Security-Portal',
    linkedinUrl:
      'https://www.linkedin.com/posts/hadia-islam-b08344377_cpp-objectorientedprogramming-cybersecurity-share-7469060114671435777-D5Ys',
    description:
      'Biometric and genomic-inspired cryptographic authentication portal built with object-oriented security patterns.',
    members: [
      {
        name: 'Hadia Islam',
        studentId: 'B25F0998AI120',
        githubUrl:
          'https://github.com/HADIA-ISLAM-543/CipherDNA-Security-Portal',
        linkedinUrl:
          'https://www.linkedin.com/posts/hadia-islam-b08344377_cpp-objectorientedprogramming-cybersecurity-share-7469060114671435777-D5Ys',
      },
      {
        name: 'Salwa Zameer',
        studentId: 'B25F2126AI161',
        githubUrl: 'https://github.com/salwakhan16k-hue/OOP-Final-Project-',
        linkedinUrl:
          'https://www.linkedin.com/posts/salwa-zameer-432731400_cpp-oop-coding-share-7469269725458456576-Sod0/',
      },
      {
        name: 'Aleesha Shabbir',
        studentId: 'B25F2175AI137',
        githubUrl: 'https://github.com/Aleesha-404/OOP-Final-Project',
        linkedinUrl:
          'https://www.linkedin.com/posts/aleesha-shabbir-5417093ba_cpp-oop-coding-share-7469665101181067264-UtKZ/',
      },
    ],
  },

  // 13. Inventory Management System
  {
    id: 'group-11-inventory-management',
    groupNumber: 11,
    groupLabel: 'Group 11',
    projectName: 'Inventory Management System',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl:
      'https://github.com/shayan856ahmad-boop/https-inventerymanagementsystem.netlify.app-',
    linkedinUrl:
      'https://www.linkedin.com/posts/shayan-ahmad-a0624338b_oop-cplusplus-softwaredevelopment-share-7469829312104431617-6Zd2/',
    description:
      'Retail stock control, automated re-ordering thresholds, and warehouse transaction records in C++ and web interfaces.',
    members: [
      {
        name: 'Shayan Ahmad',
        studentId: 'B25F0655AI116',
        githubUrl:
          'https://github.com/shayan856ahmad-boop/https-inventerymanagementsystem.netlify.app-',
        linkedinUrl:
          'https://www.linkedin.com/posts/shayan-ahmad-a0624338b_oop-cplusplus-softwaredevelopment-share-7469829312104431617-6Zd2/',
      },
      {
        name: 'M Ihtesham Alam',
        studentId: 'B25F1271AI114',
        githubUrl:
          'https://github.com/mihteshamalam-cmyk/https-spectacular-malasada-a26449.netlify.app-',
        linkedinUrl:
          'https://www.linkedin.com/feed/update/urn:li:activity:7469835420323950593/',
      },
      {
        name: 'Said Mansoor Sadaat',
        studentId: 'B25F0596AI288',
      },
    ],
  },

  // 14. University Transport System (UTS)
  {
    id: 'group-12-university-transport-system',
    groupNumber: 12,
    groupLabel: 'Group 12',
    projectName: 'University Transport System (UTS)',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl: 'https://github.com/Hasso47-h/UTS-PROJECT-OOP.git',
    linkedinUrl:
      'https://www.linkedin.com/posts/hassan-khan-000906414_cplusplus-cpp-oop-share-7469810278583656448-oXMP/',
    description:
      'Campus vehicle scheduling, passenger seating algorithms, and driver timetable management built in C++.',
    members: [
      {
        name: 'Hassan Khan',
        studentId: 'B25F2255AI121',
        githubUrl: 'https://github.com/Hasso47-h/UTS-PROJECT-OOP.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/hassan-khan-000906414_cplusplus-cpp-oop-share-7469810278583656448-oXMP/',
      },
      {
        name: 'Izaz Ali Shah',
        studentId: 'B25F2163AI145',
        githubUrl:
          'https://github.com/izazalishah54321-collab/UTS-PROJECT.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/izaz-ali-shah-52861140b_cplusplus-cpp-oop-share-7469801068558929921-GBji/',
      },
      {
        name: 'Ibad Ullah',
        studentId: 'B25F0285AI143',
        githubUrl: 'https://github.com/craxyibad/UTS-Project-OOP.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/ibad-ullah-1a529940a_cplusplus-cpp-oop-share-7469816388975558656-bbRD/',
      },
    ],
  },

  // 15. Hostel Desk
  {
    id: 'group-13-hostel-desk',
    groupNumber: 13,
    groupLabel: 'Group 13',
    projectName: 'Hostel Desk',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    description:
      'A streamlined administrative front desk system for managing dormitory room requests, visitor logs, and key checkouts.',
    members: [
      {
        name: 'Nawish Afzal',
        studentId: 'B25F1608AI146',
      },
    ],
  },

  // 16. Cafeteria Management System
  {
    id: 'group-14-cafeteria-management-system',
    groupNumber: 14,
    groupLabel: 'Group 14',
    projectName: 'Cafeteria Management System',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl:
      'https://github.com/Emanrehman-101/oop-project/tree/main/STC-Project',
    linkedinUrl:
      'https://www.linkedin.com/posts/eman-rehman-4a8847406_oop-c-webdevelopment-ugcPost-7469819055839948800-SeGY/',
    description:
      'Automated POS food ordering, campus dining balance recharge, and menu inventory tracking system.',
    members: [
      {
        name: 'Eman Rehman',
        studentId: 'B25F0649AI228',
        githubUrl:
          'https://github.com/Emanrehman-101/oop-project/tree/main/STC-Project',
        linkedinUrl:
          'https://www.linkedin.com/posts/eman-rehman-4a8847406_oop-c-webdevelopment-ugcPost-7469819055839948800-SeGY/',
      },
    ],
  },

  // 17. University Management System
  {
    id: 'group-17-university-management-system',
    groupNumber: 17,
    groupLabel: 'Group 17',
    projectName: 'University Management System',
    course: 'Object-Oriented Programming (OOP) Lab',
    semester: 'Spring 2026',
    isPublished: false,
    githubUrl:
      'https://github.com/rk8556489-byte/university-managment-system',
    linkedinUrl:
      'https://www.linkedin.com/posts/riyan-khan-2033b139b_github-rk8556489-byteuniversity-managment-system-share-7469820705732390913-PhCf/',
    description:
      'Student course registration, semester GPA calculator, faculty workload, and department record system implemented with OOP patterns.',
    members: [
      {
        name: 'Riyan Tahir',
        studentId: 'B25F0860AI112',
        githubUrl:
          'https://github.com/rk8556489-byte/university-managment-system',
        linkedinUrl:
          'https://www.linkedin.com/posts/riyan-khan-2033b139b_github-rk8556489-byteuniversity-managment-system-share-7469820705732390913-PhCf/',
      },
      {
        name: 'Habibullah Mushtaq',
        studentId: 'B25F1720AI115',
        githubUrl:
          'https://github.com/habibullahmushtaq04-gif/university-management-system.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/habibullah-mushtaq-mushtaq-8aa27440a_github-habibullahmushtaq04-gifuniversity-management-system-share-7469823515509280768-KLts/',
      },
      {
        name: 'Abdul Wahab',
        studentId: 'B25F0964AI118',
        githubUrl:
          'https://github.com/abdulwahab24k7/University-Management-System.git',
        linkedinUrl:
          'https://www.linkedin.com/posts/abdul-wahab-ab68a6388_github-abdulwahab24k7university-management-system-share-7469825125312262145-H1qx/',
      },
    ],
  },
];
