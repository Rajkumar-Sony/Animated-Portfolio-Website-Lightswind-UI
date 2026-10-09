import type { LucideIcon } from "lucide-react";
import type { StatGraphKind } from "@/components/ui/StatGraph";
import {
  BookOpen,
  Briefcase,
  Cloud,
  CodeXml,
  FolderOpen,
  Gauge,
  Github,
  GitMerge,
  GraduationCap,
  House,
  Languages,
  Layers,
  LayoutTemplate,
  Linkedin,
  Mail,
  MessageSquare,
  MonitorPlay,
  Rocket,
  Send,
  Server,
  Smartphone,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import cmritCampus from "@/assets/education/cmrit-campus.webp";
import sinhaCollege from "@/assets/education/sinha-college.webp";
import antiSocialForcesScreeningMockup from "@/assets/projects/anti-social-forces-screening-device-mockup.png";
import castMeMockup from "@/assets/projects/cast-me-device-mockup.png";
import healthcareTrackingMockup from "@/assets/projects/healthcare-it-tracking-system-device-mockup.png";
import searchWriteMockup from "@/assets/projects/search-write-device-mockup.png";

export type SectionId =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "built-projects"
  | "career"
  | "education"
  | "faq"
  | "contact";

export const profile = {
  name: "Raj Kumar Sony",
  initials: "RS",
  role: "Java Backend Engineer",
  pronouns: "He/Him",
  tagline:
    "I build secure, scalable Spring Boot microservices and REST APIs on AWS, and I own them from design and code review through to production support.",
  available: true,
  email: "rajkumar.sony@zohomail.in",
  location: "Osaka, Japan",
  /** Used for the header weather when the visitor's location can't be determined. */
  coordinates: { lat: 34.6937, lon: 135.5023 },
  website: "github.com/rajkumar-sony",
  resumeUrl: "/resume.pdf",
  photo: "https://github.com/rajkumar-sony.png?size=400",
  idCard: {
    specialty: "Java Backend & Cloud",
    experience: "4+ Years",
    company: "PLAN-B, Inc.",
    status: "Active",
    noticePeriod: "30 days",
    serial: "RKS-2023-OSA",
    credential: "MCA · CMRIT · 2022",
    issuer: "Osaka, Japan",
  },
};

export type SocialLink = { label: string; href: string; icon: LucideIcon };

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/rajkumar-sony", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rajkumarsony", icon: Linkedin },
  { label: "HackerRank", href: "https://www.hackerrank.com/rajkumarsony", icon: CodeXml },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export type NavItem = { id: SectionId; label: string; icon: LucideIcon };

export const headerNav: NavItem[] = [
  { id: "hero", label: "Home", icon: House },
  { id: "about", label: "About", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
];

export const mobileNav: NavItem[] = [
  { id: "hero", label: "Home", icon: House },
  { id: "about", label: "About", icon: User },
  { id: "services", label: "What I Do", icon: Server },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "built-projects", label: "Projects I Built", icon: CodeXml },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "faq", label: "FAQ", icon: MessageSquare },
  { id: "contact", label: "Contact", icon: Send },
];

export const dockNav: NavItem[] = [
  { id: "hero", label: "Home", icon: House },
  { id: "about", label: "About", icon: User },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "built-projects", label: "Built", icon: CodeXml },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "faq", label: "FAQ", icon: MessageSquare },
  { id: "contact", label: "Contact", icon: Send },
];

export const footerNav: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "career", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "built-projects", label: "Projects I Built" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/** `slug` is a Simple Icons slug, `src` a full logo URL; `mono` icons are inverted in dark mode. */
export type Tech = { name: string; slug?: string; src?: string; mono?: boolean };

export const techStack: Tech[] = [
  { name: "Java", slug: "openjdk", mono: true },
  { name: "Spring Boot", slug: "springboot" },
  { name: "Spring Security", slug: "springsecurity" },
  { name: "Hibernate", slug: "hibernate" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MySQL", slug: "mysql" },
  {
    name: "AWS",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  },
  { name: "Docker", slug: "docker" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Jenkins", slug: "jenkins" },
  { name: "Apache Kafka", slug: "apachekafka", mono: true },
  { name: "Redis", slug: "redis" },
  { name: "GitHub Actions", slug: "githubactions" },
  { name: "JUnit 5", slug: "junit5" },
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Python", slug: "python" },
];

export const about = {
  headline: ["Backend engineer for", "Reliable Systems"] as const,
  body: "I'm a Java Backend Engineer with over four years of experience, currently a Software Engineer at PLAN-B, Inc. in Osaka. After my MCA at CMR Institute of Technology, Bangalore, I worked on a healthcare platform at Cognizant before moving to Japan. My daily work is Spring Boot, Spring Security, REST APIs, JPA/Hibernate, PostgreSQL and AWS: designing APIs, fixing production issues, tuning SQL, reviewing code and writing JUnit and Mockito tests. I hold JLPT N3, so I work comfortably with Japanese teammates as well as in English.",
  stats: [
    { value: 4, suffix: "+", label: "Years Experience", icon: LayoutTemplate, graph: "rise" },
    { value: 3, suffix: "", label: "SaaS Products Shipped", icon: Rocket, graph: "bars" },
    { value: 60, suffix: "%", label: "API Latency Cut", icon: Zap, graph: "drop" },
    { value: 50, suffix: "%", label: "Faster Release Cycles", icon: Gauge, graph: "pulse" },
  ] satisfies { value: number; suffix: string; label: string; icon: LucideIcon; graph: StatGraphKind }[],
};

export const services = [
  {
    title: "Backend API Development",
    description:
      "Spring Boot REST APIs with clear contracts, validation, consistent error handling, JPA/Hibernate data access and JUnit/Mockito tests.",
    icon: CodeXml,
  },
  {
    title: "Microservices & Migration",
    description:
      "Moving legacy platforms to Spring Boot microservices flow by flow, keeping existing API contracts and authentication working along the way.",
    icon: GitMerge,
  },
  {
    title: "Cloud & DevOps",
    description:
      "Running services on AWS with Docker and Kubernetes, Jenkins and Maven pipelines, and CloudWatch monitoring for faster, safer releases.",
    icon: Cloud,
  },
  {
    title: "Production Support & Performance",
    description:
      "Root cause analysis from logs and metrics, SQL query and index tuning, and fixes that bring down latency and recovery time.",
    icon: Server,
  },
];

export type CaseStudy = {
  context: string;
  role: string;
  period: string;
  location: string;
  team?: string;
  /** Job titles held while on the project, newest first. */
  roles: { title: string; period: string }[];
  problem: string;
  responsibilities: string[];
  /** Request path through the system, one hop per entry. */
  architecture: string[];
  contributions: string[];
  outcomes: { value: string; label: string }[];
  stack: { group: string; items: string[] }[];
};

export type Project = {
  title: string;
  summary: string;
  tags: string[];
  image: { src: string; srcSet: string; alt: string };
  caseStudy: CaseStudy;
};

const projectMockup = (src: string, alt: string) => ({
  src,
  srcSet: src,
  alt,
});

/** Newest first, by when the work ended (ongoing work counts as newest). */
export const projects: Project[] = [
  {
    title: "Cast Me!",
    summary: "Influencer marketing platform migrated from PHP to Spring Boot microservices, cutting API latency by 60%",
    tags: ["Spring Boot", "Spring Security", "OAuth2"],
    image: projectMockup(castMeMockup, "Device mockups showing the Cast Me! influencer marketing dashboard"),
    caseStudy: {
      context: "PLAN-B, Inc. · Influencer marketing platform",
      role: "Backend engineer on the PHP to Spring Boot migration",
      period: "Sep 2023 – Sep 2024 · Apr 2025 – Present",
      location: "Osaka, Japan · Hybrid",
      team: "CastMe! team",
      roles: [
        { title: "Full Stack Engineer + AWS Cloud", period: "Apr 2025 – Present" },
        { title: "Java Software Engineer", period: "Sep 2023 – Sep 2024" },
      ],
      problem:
        "The platform connecting brands with Instagram and TikTok influencers ran on a legacy PHP backend that was slow and expensive to run, while live users depended on it every day.",
      responsibilities: [
        "Built REST APIs on the new Spring Boot backend for the influencer, campaign, profile and Instagram/TikTok integration modules",
        "Implemented OAuth2-based authentication and authorization with Spring Security",
        "Found and fixed slow endpoints as part of the migration's performance work",
        "Worked with frontend developers on API contracts and with QA on regression testing before each release",
        "Supported the platform in production, tracing issues through logs and AWS CloudWatch",
      ],
      architecture: [
        "Frontend keeps calling the same API paths, fields and status codes",
        "Spring Security validates the OAuth2-based authentication on every request",
        "Spring Boot services split by business area: influencer, campaign, profile, social integration",
        "Spring Data JPA / Hibernate handles persistence in the new backend",
      ],
      contributions: [
        "Rebuilt endpoints in Spring Boot while preserving existing contracts, so the frontend didn't notice which backend answered",
        "Agreed API changes with frontend developers before coding and added new fields as optional",
        "Worked with QA on regression runs before each part of the old backend was retired",
      ],
      outcomes: [
        { value: "60%", label: "Lower API latency" },
        { value: "35%", label: "Lower server infrastructure cost" },
      ],
      stack: [
        { group: "Backend", items: ["Java", "Spring Boot", "REST APIs", "Spring Data JPA", "Hibernate"] },
        { group: "Security", items: ["Spring Security", "OAuth2"] },
        { group: "Integrations", items: ["Instagram API", "TikTok API"] },
        { group: "Data & cloud", items: ["SQL", "AWS", "CloudWatch"] },
      ],
    },
  },
  {
    title: "SEARCH WRITE",
    summary: "AI-powered SEO content platform where I led the Spring Boot backend; content engagement up 70%",
    tags: ["Spring Boot", "AWS", "GPT"],
    image: projectMockup(searchWriteMockup, "Device mockups showing the SEARCH WRITE AI content dashboard"),
    caseStudy: {
      context: "PLAN-B, Inc. · AI SEO content platform",
      role: "Backend Lead for the Spring Boot services",
      period: "Oct 2024 – Mar 2025",
      location: "Osaka, Japan · Hybrid",
      team: "SEARCH WRITE team",
      roles: [{ title: "Full Stack Software Engineer", period: "Oct 2024 – Mar 2025" }],
      problem:
        "Writing search-friendly articles by hand takes a lot of time. SEARCH WRITE puts GPT behind a normal web product, so a user describes what they need and gets a usable draft instead of a blank page.",
      responsibilities: [
        "Owned the Spring Boot backend: REST APIs, request validation and storing requests and generated content in DynamoDB",
        "Owned the contract between the Java and Python services: payload shape, request IDs, timeouts and error codes",
        "Integrated the Python FastAPI services that run LangChain and GPT; the prompt and model code stayed on the Python side",
        "Reviewed backend code and kept the services to the team's coding standards",
        "Unit-tested service logic with JUnit and Mockito, covering success, timeout and error responses from the AI service",
      ],
      architecture: [
        "Browser sends a content request over REST",
        "Spring Boot authenticates the user, validates input and applies limits",
        "Python FastAPI service builds the prompt with LangChain and calls GPT",
        "Spring Boot checks the generated text and stores it in DynamoDB",
        "WebSocket pushes progress and the result back to the browser",
      ],
      contributions: [
        "Designed the Spring Boot APIs the frontend calls, with validation and consistent error responses",
        "Integrated with the Python AI services over HTTP, with connect and response timeouts and a request ID logged on both sides",
        "Treated model output as untrusted input, checking its shape and size before saving or showing it",
        "Handled the unhappy path: fail fast on a slow model, limited retries, and a retryable status the user can see",
      ],
      outcomes: [{ value: "70%", label: "Increase in content engagement" }],
      stack: [
        { group: "Backend", items: ["Java", "Spring Boot", "REST APIs", "WebSocket"] },
        { group: "AI integration", items: ["Python FastAPI", "LangChain", "GPT"] },
        { group: "Data & cloud", items: ["DynamoDB", "AWS"] },
        { group: "Testing", items: ["JUnit", "Mockito"] },
      ],
    },
  },
  {
    title: "Anti-Social Forces Screening",
    summary: "Compliance SaaS for screening organizations, delivered from design to deployment",
    tags: ["React", "Spring Boot", "AWS"],
    image: projectMockup(
      antiSocialForcesScreeningMockup,
      "Device mockups showing the Anti-Social Forces Screening compliance dashboard",
    ),
    caseStudy: {
      context: "PLAN-B, Inc. · Compliance SaaS",
      role: "Full SDLC, from design to deployment",
      period: "Feb 2023 – Aug 2023",
      location: "Osaka, Japan · On-site",
      team: "Anti-Social Forces Screening team",
      roles: [{ title: "Software Engineer (SaaS Engineer)", period: "Feb 2023 – Aug 2023" }],
      problem:
        "Companies in Japan screen business partners for links to anti-social forces as part of compliance. The app gives users one place to run those screenings and review the results.",
      responsibilities: [
        "Designed backend endpoints and their request and response formats",
        "Wrote the Spring Boot service and data access code behind them, with paging and filtering in the database queries",
        "Enforced permission checks so every read returns only the user's own organization's screenings",
        "Tested service logic with JUnit and Mockito, and endpoints with integration tests including cross-organization access",
        "Worked with the React developers on integration and followed each feature through to deployment",
      ],
      architecture: [
        "React frontend where users run screenings and review results",
        "Spring Boot REST APIs over HTTPS hold the business rules",
        "Every request is authenticated, and the backend decides what each user may see",
        "A database stores screening data, all running on AWS",
      ],
      contributions: [
        "Developed the backend REST APIs and the database features behind them",
        "Added security enhancements around authentication and per-user data access",
        "Connected the React screens to the APIs, including loading and error states",
        "Took the product through design, development, testing and deployment",
      ],
      outcomes: [{ value: "End to end", label: "Owned across the full SDLC" }],
      stack: [
        { group: "Frontend", items: ["React"] },
        { group: "Backend", items: ["Java", "Spring Boot", "REST APIs", "Spring Security"] },
        { group: "Data & cloud", items: ["SQL", "AWS"] },
        { group: "Testing", items: ["JUnit", "Mockito"] },
      ],
    },
  },
  {
    title: "Healthcare IT Tracking System",
    summary: "Cognizant healthcare platform; MySQL query and index tuning cut data retrieval time by 35%",
    tags: ["Spring Boot", "Angular", "MySQL"],
    image: projectMockup(
      healthcareTrackingMockup,
      "Device mockups showing the Healthcare IT Tracking System dashboard",
    ),
    caseStudy: {
      context: "Cognizant Technology Solutions · Healthcare IT",
      role: "Programmer Analyst, Java full stack",
      period: "Mar 2022 – Sep 2022",
      location: "Bangalore, India",
      roles: [{ title: "Programmer Analyst – Java Full Stack", period: "Mar 2022 – Sep 2022" }],
      problem:
        "A healthcare tracking system needed faster data access and a smoother experience for the people using it every day.",
      responsibilities: [
        "Developed Spring Boot REST endpoints, the service logic behind them and the MySQL data access",
        "Worked on the slow data-retrieval paths: found the costly queries and tuned them with targeted indexes",
        "Contributed to Angular screens that call the backend APIs",
        "Took part in peer code reviews to keep coding standards",
        "Worked across the SDLC, from requirements through deployment and production support",
      ],
      architecture: [
        "Angular screens call Spring Boot REST APIs",
        "Spring Boot services hold the application logic",
        "MySQL stores tracking data, tuned with targeted queries and indexes",
        "Services run on AWS",
      ],
      contributions: [
        "Developed and enhanced features with Java, Spring Boot, REST APIs and Angular",
        "Improved the end-user experience of the tracking system",
        "Improved how the application used its AWS resources",
      ],
      outcomes: [
        { value: "35%", label: "Faster data retrieval" },
        { value: "40%", label: "Better AWS resource utilization" },
        { value: "30%", label: "Improved end-user experience" },
      ],
      stack: [
        { group: "Frontend", items: ["Angular"] },
        { group: "Backend", items: ["Java", "Spring Boot", "REST APIs"] },
        { group: "Data & cloud", items: ["MySQL", "AWS"] },
      ],
    },
  },
];

export type CareerEntry = {
  period: string;
  title: string;
  company: string;
  description: string;
  icon: LucideIcon;
  /** Role progression within the same company, newest first. */
  roles?: { title: string; period: string; note?: string }[];
};

/** Oldest first, so the latest role arrives last. */
export const career: CareerEntry[] = [
  {
    period: "Nov 2018 – Feb 2019",
    title: "Certification Training (Apprenticeship)",
    company: "Durga Software Solutions · Hyderabad, India",
    description:
      "Completed on-site certification training in Java SE, Java EE and Oracle, working with Servlets and JavaFX.",
    icon: BookOpen,
  },
  {
    period: "Jul 2021 – Sep 2021",
    title: "Developer Intern",
    company: "Fyndhere Services Pvt Ltd · Hyderabad, India · Remote",
    description:
      "Completed a three-month remote internship as a mobile app developer, building with the Ionic Framework and Firebase.",
    icon: Smartphone,
  },
  {
    period: "Mar 2022 – Sep 2022",
    title: "Programmer Analyst – Java Full Stack",
    company: "Cognizant Technology Solutions · Bangalore, India",
    description:
      "Developed and enhanced a Healthcare IT Tracking System with Java, Spring Boot, Angular and MySQL, improving end-user experience by 30%. Improved AWS resource utilization by 40% and reduced data retrieval time by 35% through MySQL query optimization and indexing. Worked across the full SDLC and took part in peer code reviews.",
    icon: Briefcase,
  },
  {
    period: "Feb 2023 – Present",
    title: "Software Engineer – Java Backend / SaaS",
    company: "PLAN-B, Inc. · Osaka, Japan",
    description:
      "Design and build B2B SaaS backend services with Java, Spring Boot, microservices and AWS. Migrated legacy PHP platforms to Spring Boot, cutting API latency by 60% and server costs by 35%. Automated CI/CD with Jenkins, Maven, Docker and Kubernetes, halving release cycle time and cutting MTTR by 40%. Handle production issues with CloudWatch, review code and maintain API documentation.",
    icon: Layers,
    roles: [
      {
        title: "SaaS Engineer",
        period: "Feb 2023 – Aug 2023",
        note: "Anti-Social Forces Screening team · On-site",
      },
      { title: "Java Software Engineer", period: "Sep 2023 – Sep 2024", note: "CastMe! team · Hybrid" },
      { title: "Full Stack Software Engineer", period: "Oct 2024 – Mar 2025", note: "SEARCH WRITE team · Hybrid" },
      { title: "Full Stack Engineer + AWS Cloud", period: "Apr 2025 – Present", note: "CastMe! team" },
    ],
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  badge: { label: string; tone: "success" | "neutral" };
  icon: LucideIcon;
  /** Card background; without one the card shows the accent gradient. */
  image?: string;
  highlights: string[];
};

/** Oldest first, so the latest degree stacks on top last. */
export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "Sachchidanand Sinha College (Magadh University), Aurangabad, Bihar",
    period: "May 2015 – Oct 2018",
    badge: { label: "70.75%", tone: "neutral" },
    icon: BookOpen,
    image: sinhaCollege,
    highlights: [
      "Graduated with an aggregate of 70.75%",
      "Undergraduate degree in computer applications that led into the MCA",
    ],
  },
  {
    degree: "Master of Computer Applications (MCA)",
    school: "CMR Institute of Technology (VTU), Bangalore",
    period: "Aug 2019 – Sep 2022",
    badge: { label: "CGPA 8.4/10", tone: "success" },
    icon: GraduationCap,
    image: cmritCampus,
    highlights: [
      "Graduated with a CGPA of 8.4 out of 10",
      "Joined Cognizant as a Programmer Analyst in March 2022, during the final months of the program",
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  issued?: string;
  credentialId?: string;
  url?: string;
};

/** A HackerRank skill badge: stars earned out of five. */
export type SkillBadge = { name: string; stars: number; solved: number };

export type CertificationGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Singular word used in the item count; defaults to "certificate". */
  itemNoun?: string;
  /** Oldest first, so the latest credential comes last. */
  items: Certification[];
  badges?: SkillBadge[];
  badgesUrl?: string;
};

const hackerRankCert = (name: string, issued: string, id: string): Certification => ({
  name,
  issuer: "HackerRank",
  issued,
  credentialId: id.toUpperCase(),
  url: `https://www.hackerrank.com/certificates/${id}`,
});

/** Licenses & certifications from LinkedIn and the public HackerRank profile, grouped by provider. */
export const certificationGroups: CertificationGroup[] = [
  {
    id: "udemy",
    label: "Udemy",
    icon: MonitorPlay,
    items: [
      {
        name: "Ultimate AWS Certified Solutions Architect Associate 2026",
        issuer: "Udemy · Course completion",
        issued: "Aug 2026",
        credentialId: "UC-16e08890-c8ec-4913-a452-2395cbe5a865",
        url: "https://www.udemy.com/certificate/UC-16e08890-c8ec-4913-a452-2395cbe5a865/",
      },
      {
        name: "Ultimate AWS Certified Developer Associate 2026 – DVA-C02",
        issuer: "Udemy · Course completion",
        issued: "Sep 2026",
        url: "https://www.linkedin.com/posts/rajkumarsony_udemy-course-completion-certificate-activity-7503616797883994112-3-qE",
      },
    ],
  },
  {
    id: "hackerrank",
    label: "HackerRank",
    icon: CodeXml,
    items: [
      hackerRankCert("Java (Basic)", "Nov 2020", "316b2d5ef495"),
      hackerRankCert("Problem Solving (Basic)", "Mar 2021", "1da1b97e16f4"),
      hackerRankCert("Python (Basic)", "Oct 2021", "0cc245be1504"),
      hackerRankCert("Frontend Developer (React)", "Dec 2023", "b7742193c7e1"),
      hackerRankCert("SQL (Intermediate)", "Dec 2023", "7b3c4bc658cc"),
      hackerRankCert("Rest API (Intermediate)", "Jan 2024", "e22145b8d39e"),
      hackerRankCert("Software Engineer Intern", "Jan 2024", "00f1bca20033"),
      hackerRankCert("SQL (Basic)", "May 2025", "6e23d395302c"),
      hackerRankCert("SQL (Advanced)", "May 2025", "8162bf6b0eb9"),
      hackerRankCert("JavaScript (Intermediate)", "May 2025", "0d1f39f2cc30"),
    ],
    badges: [
      { name: "Python", stars: 5, solved: 115 },
      { name: "30 Days of Code", stars: 5, solved: 30 },
      { name: "10 Days of Statistics", stars: 5, solved: 27 },
      { name: "10 Days of JS", stars: 5, solved: 25 },
      { name: "Java", stars: 4, solved: 16 },
      { name: "Problem Solving", stars: 3, solved: 22 },
      { name: "SQL", stars: 1, solved: 10 },
      { name: "C", stars: 1, solved: 9 },
    ],
    badgesUrl: "https://www.hackerrank.com/profile/rajkumarsony",
  },
  {
    id: "language",
    label: "Language",
    icon: Languages,
    items: [
      {
        name: "Japanese Language (N5 & N4) – Pre-Intermediate Level Training",
        issuer: "ZENKEN INDIA LLP",
        issued: "Sep 2022",
        url: "https://drive.google.com/file/d/1YnkdSSzC1itDxQD1POiy3BXM36-XkFm3/view",
      },
      { name: "JLPT N3 (Japanese-Language Proficiency Test)", issuer: "The Japan Foundation & JEES", issued: "Jan 2025" },
    ],
  },
  {
    id: "google-cloud",
    label: "Google Cloud",
    icon: Cloud,
    items: [
      {
        name: "30 Days Google Cloud Program",
        issuer: "Qwiklabs",
        credentialId: "0420f4b6-de78-4711-8749-ea38f0b25420",
        url: "https://www.cloudskillsboost.google/public_profiles/0420f4b6-de78-4711-8749-ea38f0b25420",
      },
      {
        name: "Learn to Earn Cloud Challenge",
        issuer: "Qwiklabs",
        credentialId: "efd447cc-a289-44c3-810f-0a041e6d9d74",
        url: "https://google.qwiklabs.com/public_profiles/efd447cc-a289-44c3-810f-0a041e6d9d74",
      },
    ],
  },
  {
    id: "courses",
    label: "Other Courses",
    icon: BookOpen,
    itemNoun: "course",
    items: [
      {
        name: "Java SE, Java EE & Oracle – Certification Training",
        issuer: "Durga Software Solutions",
        issued: "Feb 2019",
      },
      {
        name: "Step into Robotic Process Automation",
        issuer: "Guvi Code Camp SRM",
        issued: "Aug 2020",
        credentialId: "78A9CK3S7438Q7Y51X",
        url: "https://www.guvi.in/verify-certificate?id=78A9CK3S7438Q7Y51X",
      },
      { name: "Microsoft AI Classroom Series", issuer: "Microsoft", issued: "Dec 2020" },
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    itemNoun: "achievement",
    items: [
      {
        name: "Certificate of Achievement",
        issuer: "Rakuten India",
        issued: "Nov 2019",
        url: "https://drive.google.com/file/d/1NZ79agRfRbmhRjkJoC7ZRssIWl3sHnLV/view",
      },
    ],
  },
];

export const skills = {
  technical: [
    { name: "Java 11/17 & Spring Boot", level: 92 },
    { name: "REST APIs & Microservices", level: 90 },
    { name: "SQL (PostgreSQL / MySQL)", level: 85 },
    { name: "AWS (EC2, S3, Lambda, SQS, CloudWatch)", level: 80 },
    { name: "Docker / Kubernetes / Jenkins CI-CD", level: 75 },
    { name: "React / TypeScript (integration)", level: 60 },
  ],
  traits: [
    { name: "Production Support", tone: "amber" },
    { name: "Problem Solving", tone: "violet" },
    { name: "Agile / Scrum", tone: "sky" },
    { name: "Code Reviews", tone: "rose" },
    { name: "Technical Documentation", tone: "yellow" },
    { name: "Cross-Team Collaboration", tone: "emerald" },
  ] as const,
  learner: {
    title: "JLPT N3 & Always Learning",
    body: "Earned JLPT N3 Japanese in January 2025 and completed AWS Solutions Architect Associate preparation; now deepening system design and cloud architecture.",
  },
};

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Tell me about yourself.",
    answer:
      "I'm a Java Backend Engineer at PLAN-B, Inc. in Osaka with over four years of professional experience. I did my MCA at CMR Institute of Technology, Bangalore, worked at Cognizant, then moved to Japan. My core stack is Java, Spring Boot, Spring Security, REST APIs, microservices, JPA/Hibernate, PostgreSQL and AWS, and I've shipped three SaaS products at PLAN-B.",
  },
  {
    question: "What do you work on day to day?",
    answer:
      "Mostly designing and building backend APIs in Java and Spring Boot. Around that I handle production issues, tune SQL queries, review code, write unit tests and plan sprints with product managers, QA and other developers.",
  },
  {
    question: "What is your strongest technology?",
    answer:
      "Java with Spring Boot. I can take an endpoint and walk through it from the controller to the service, the repository and the SQL it produces, including validation, error responses, transactions and the JUnit and Mockito tests around it.",
  },
  {
    question: "What was your biggest project?",
    answer:
      "Cast Me!, an influencer marketing platform. I took part in migrating its backend from PHP to Spring Boot, built REST APIs and OAuth2-based security, and kept existing API contracts stable for the frontend. The migration cut API latency by 60% and server costs by 35%.",
  },
  {
    question: "How much frontend work do you do?",
    answer:
      "My strength is the backend. My frontend work is React and TypeScript integration: wiring screens to the APIs I build, matching request and response types, passing auth tokens and handling errors. That work taught me to design APIs around the screens that call them.",
  },
  {
    question: "How do you work in a Japanese team?",
    answer:
      "I have JLPT N3 Japanese, so I take part in meetings and day-to-day discussion in Japanese, while most technical writing is in English. I confirm API contracts and requirements in writing and keep tickets current, so decisions don't get lost between languages.",
  },
];

export const contact = {
  intro:
    "I'm open to Java backend and cloud engineering roles. Whether it's an opportunity, a question about my work or just a hello, send a message and I'll get back to you.",
};

export const footer = {
  eyebrow: "Design, Build & Ship",
  signature: "Raj Kumar Sony",
  rotatingRoles: ["Java Backend Engineer", "Spring Boot Developer", "Cloud & Microservices"],
};
