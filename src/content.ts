export type NavLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
};

export type Project = {
  title: string;
  image: string;
  imagePosition?: string;
  github?: string;
  demo?: string;
  demoLabel?: string;
  description?: string;
  productFeatures?: string[];
  technicalFeatures?: string[];
  featured?: boolean;
};

export type EducationEntry = {
  title: string;
  issuer: string;
  year: string;
  summary?: string;
  link?: string;
};

export type GradientPreset = {
  name: string;
  colors: string[];
  rotation?: number;
  speed?: number;
  warpStrength?: number;
  frequency?: number;
};

export const navLinks: NavLink[] = [
  {
    label: "Download CV",
    href: "/assets/GiacomoImpocoCV2026.pdf",
    newTab: true,
  },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/giacomoimpoco/",
    icon: "/assets/linkedin.png",
  },
  {
    label: "GitHub",
    href: "https://github.com/gimpoco1",
    icon: "/assets/github.png",
  },
];

export const techStack = [
  "HTML",
  "CSS",
  "React",
  "JavaScript",
  "TypeScript",
  "Next JS",
  "Chakra UI",
  "TailwindCSS",
  "Node JS",
  "NestJS",
  "PostgreSQL",
  "Express/KOA",
  "Git CD/CI",
  "MongoDB",
  "Redux",
  "Storybook",
  "Python",
  "Django",
  "Docker",
  "Vite",
  "Figma",
  "iOS",
  "Swift",
  "Capacitor",
  "Apple StoreKit",
  "Supabase",
  "Stripe",
  "Google AdSense",
  "Three.js",
];

export const projects: Project[] = [
  {
    title: "Plink - Score Tracker",
    image: "/assets/plink-banner.png",
    github: "https://github.com/gimpoco1/plink",
    demo: "https://plinkscore.com",
    demoLabel: "Visit site",
    description:
      "A cross-platform scorekeeping experience for card, board, and party games. Plink combines fast live scoring with flexible game rules, session history, player and team insights, and a production-ready freemium platform across web and iOS.",
    productFeatures: [
      "Live score tracking",
      "Flexible win conditions",
      "Players & teams",
      "Timers & dice",
      "Session history",
      "Advanced statistics",
      "Shareable results",
      "Backup & restore",
    ],
    technicalFeatures: [
      "iOS with Capacitor",
      "Native Swift / StoreKit",
      "Apple subscriptions",
      "Stripe billing",
      "Supabase auth & cloud sync",
      "Google AdSense",
      "Edge Functions & webhooks",
      "Offline guest mode",
      "React & TypeScript",
      "Recharts analytics",
    ],
    featured: true,
  },
  {
    title: "Hecate - Explore the World",
    image: "/assets/hecate.png",
    imagePosition: "center 15%",
    github: "https://github.com/gimpoco1/hecate",
    demo: "https://hecate-eta.vercel.app/",
    demoLabel: "Visit site",
    description:
      "A private map of the world you have personally discovered. Hecate reveals streets, neighbourhoods, and cities as you move through them, turning everyday journeys into a living record of exploration.",
    productFeatures: [
      "Live journey tracking",
      "Personal discovery map",
      "City exploration progress",
      "Favourite places",
      "Private cloud sync",
    ],
    featured: true,
  },
  {
    title: "Building Construction Company",
    image: "/assets/mpkbuildings.png",
    github: "https://github.com/gimpoco1/mpk-buildings",
    demo: "https://mpkbuildings.com/",
    demoLabel: "Visit site",
    description:
      "A polished company website that presents specialist building services, completed work, and a clear path for prospective clients to request a quote.",
    productFeatures: [
      "Service showcase",
      "Project portfolio",
      "Quote enquiries",
    ],
  },
  {
    title: "E-commerce Marketplace",
    image: "/assets/marketplace.png",
    github: "https://github.com/gimpoco1/market-place",
    demo: "https://treasure-ireland.vercel.app/",
    description:
      "A complete online marketplace with product discovery, customer accounts, cart and checkout flows, plus order and catalogue tools for administrators.",
    productFeatures: [
      "Product discovery",
      "Shopping cart",
      "Customer accounts",
      "Checkout",
      "Admin dashboard",
    ],
  },
  {
    title: "Level Up Game",
    image: "/assets/levelup.png",
    github: "https://github.com/gimpoco1/Level-Up",
    description:
      "A playful challenge app for discovering delightfully useless skills, tracking progress, and celebrating each completed milestone.",
    productFeatures: [
      "Interactive challenges",
      "Progress tracking",
      "Milestone animations",
      "Responsive experience",
    ],
  },
];

export const experienceStartYear = 2022;

export const education: EducationEntry[] = [
  {
    title: "Full-Stack Web Development Bootcamp",
    issuer: "Codeworks",
    year: "2024",
    summary:
      "Completed an intensive full-stack web development bootcamp focusing on modern web technologies and best practices.",
  },
  {
    title: "Databases for Back-End Development",
    issuer: "Coursera",
    year: "2023",
    summary:
      "Learned about database design, SQL, and back-end data management.",
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Coursera",
    year: "2023",
    summary:
      "Gained foundational knowledge of AWS cloud concepts, services, and best practices.",
  },
  {
    title: "Google IT Support Specialization",
    issuer: "Coursera",
    year: "2022",
    summary:
      "Gained foundational IT support skills including troubleshooting, system administration, and security.",
  },
];
