import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  CodeXml,
  Cpu,
  FolderOpen,
  Github,
  Globe,
  GraduationCap,
  House,
  Layers,
  LayoutTemplate,
  Linkedin,
  Mail,
  MessageSquare,
  Palette,
  Send,
  Smile,
  Twitter,
  User,
  Users,
} from "lucide-react";

const pexels = (id: number, width: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export type SectionId =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "career"
  | "education"
  | "testimonials"
  | "contact";

export const profile = {
  name: "Scarlett Rose",
  initials: "SR",
  role: "Director of Product Engineering",
  pronouns: "She/Her",
  tagline:
    "I build exceptional and accessible digital experiences. Specialized in crafting premium web applications with elegant design systems.",
  available: true,
  email: "hello@scarlettrose.dev",
  phone: "+1 (234) 567-8900",
  location: "San Francisco, CA",
  /** Used for the header weather when the visitor's location can't be determined. */
  coordinates: { lat: 37.7749, lon: -122.4194 },
  website: "scarlettrose.dev",
  resumeUrl: "/resume.pdf",
  photo: pexels(5908778, 400),
  idCard: {
    specialty: "Full-Stack AI & UX",
    experience: "10+ Years",
    status: "Active",
    serial: "SR-89240-PRO",
    issuer: "Lightswind UI",
  },
};

export type SocialLink = { label: string; href: string; icon: LucideIcon };

export const socials: SocialLink[] = [
  { label: "Twitter", href: "https://twitter.com/", icon: Twitter },
  { label: "GitHub", href: "https://github.com/", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
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

export const dockNav: NavItem[] = [
  { id: "hero", label: "Home", icon: House },
  { id: "about", label: "About", icon: User },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "contact", label: "Contact", icon: Send },
];

export const footerNav: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "career", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/** `slug` is a Simple Icons slug, `src` a full logo URL; `mono` icons are inverted in dark mode. */
export type Tech = { name: string; slug?: string; src?: string; mono?: boolean };

export const techStack: Tech[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs", mono: true },
  { name: "TypeScript", slug: "typescript" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "GraphQL", slug: "graphql" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Framer Motion", slug: "framer", mono: true },
  { name: "MongoDB", slug: "mongodb" },
  { name: "PostgreSQL", slug: "postgresql" },
  {
    name: "AWS",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  },
  { name: "Docker", slug: "docker" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Redis", slug: "redis" },
  { name: "Figma", slug: "figma" },
  { name: "Redux", slug: "redux" },
];

export const about = {
  headline: ["Passionate about", "Digital Excellence"] as const,
  body: "I am a seasoned Full-Stack Developer and UI/UX Designer with over 10 years of experience delivering high-quality software solutions for global enterprises and startups. My career blends deep technical expertise with leadership skills, enabling me to design, build, and lead innovative digital products from concept to launch.",
  stats: [
    { value: 10, suffix: "+", label: "Years Experience", icon: LayoutTemplate },
    { value: 150, suffix: "+", label: "Projects Completed", icon: CodeXml },
    { value: 50, suffix: "+", label: "Happy Clients", icon: Smile },
    { value: 12, suffix: "", label: "Global Brands", icon: Globe },
  ],
};

export const services = [
  {
    title: "Full-Stack Development",
    description:
      "End-to-end web applications built with modern frameworks and highly scalable backend architectures.",
    icon: CodeXml,
  },
  {
    title: "UI/UX Architecture",
    description:
      "Designing intuitive, accessible, and stunning interfaces that prioritize user experience and conversion.",
    icon: Palette,
  },
  {
    title: "Performance Optimization",
    description:
      "Auditing and supercharging existing codebases for lightning-fast load times and seamless interactions.",
    icon: Cpu,
  },
  {
    title: "Systems Architecture",
    description:
      "Designing complex microservices, API integrations, and robust database models for enterprise needs.",
    icon: Layers,
  },
];

export type Project = {
  title: string;
  summary: string;
  tags: string[];
  href: string;
  image: { src: string; srcSet: string; alt: string };
};

const projectImage = (id: number, alt: string) => ({
  src: pexels(id, 1200),
  srcSet: `${pexels(id, 640)} 640w, ${pexels(id, 1200)} 1200w, ${pexels(id, 1800)} 1800w`,
  alt,
});

export const projects: Project[] = [
  {
    title: "AI-Powered Design Platform",
    summary: "Generative assets and automated scaling for e-commerce platforms",
    tags: ["Next.js", "Python", "AWS"],
    href: "#projects",
    image: projectImage(8294591, "A white humanoid robot against a dark background"),
  },
  {
    title: "Global E-Learning",
    summary: "Serving 1.2M+ active students worldwide",
    tags: ["React", "GraphQL", "Redis"],
    href: "#projects",
    image: projectImage(15595050, "A desk with a world map report and a laptop keyboard"),
  },
  {
    title: "Modular ERP System",
    summary: "Enterprise logistics & supply chain manufacturing engine",
    tags: ["Node.js", "PostgreSQL", "Kubernetes"],
    href: "#projects",
    image: projectImage(1148820, "Rows of server racks lit with blue light"),
  },
  {
    title: "Fintech Predictive Dashboard",
    summary: "Real-time analytics, algorithmic trading & risk modeling",
    tags: ["TypeScript", "D3", "Kafka"],
    href: "#projects",
    image: projectImage(6169673, "A smiling courier holding a parcel in a delivery van"),
  },
];

export type CareerEntry = {
  period: string;
  title: string;
  company: string;
  description: string;
  icon: LucideIcon;
};

export const career: CareerEntry[] = [
  {
    period: "2024 – Present",
    title: "Director of Product Engineering",
    company: "TechNova Global Solutions",
    description:
      "Leading a 200+ engineering team across 5 continents, overseeing full product lifecycle from ideation to global deployment. Introduced AI-driven development pipelines, reducing time-to-market by 38%. Established enterprise-wide accessibility and sustainability design standards.",
    icon: Globe,
  },
  {
    period: "2020 – 2024",
    title: "Senior Principal Engineer & Design Strategist",
    company: "Innova Digital Labs",
    description:
      "Architected scalable microservices for financial and healthcare industries, serving 20M+ active users. Directed the adoption of a unified design system across 12 product lines, increasing brand consistency and dev speed by 50%. Mentored 40+ senior engineers into leadership positions.",
    icon: Layers,
  },
  {
    period: "2016 – 2020",
    title: "Lead Full-Stack Developer",
    company: "Skyline Interactive",
    description:
      "Spearheaded the creation of immersive web applications using React, GraphQL, and Node.js for high-profile clients. Reduced application load times by 70% through advanced performance optimization. Introduced component-driven workflows that became the company's standard practice.",
    icon: Briefcase,
  },
  {
    period: "2012 – 2016",
    title: "Senior UI/UX Designer",
    company: "PixelForge Studios",
    description:
      "Designed award-winning digital experiences for global brands, winning multiple Awwwards and Webby Awards. Championed user-centered design by integrating continuous feedback loops into every sprint. Collaborated with cross-functional teams to unify visual and interaction design.",
    icon: Award,
  },
  {
    period: "2008 – 2012",
    title: "Frontend Developer & Interaction Designer",
    company: "CreativeSpark Agency",
    description:
      "Built responsive and interactive marketing websites during the rise of mobile-first design. Created high-conversion landing pages for major e-commerce campaigns. Developed custom animations that improved user engagement metrics by over 45%.",
    icon: Users,
  },
];

export const education = [
  {
    degree: "M.Sc. in Computer Science",
    school: "University of Chennai",
    period: "2016 – 2018",
    badge: { label: "IEEE Published Author", tone: "success" as const },
    icon: GraduationCap,
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: [
      "Specialized in Software Architecture, Distributed Systems, and AI Applications",
      "Thesis on Machine Learning for Predictive Analytics & Neural Optimization",
      "Led enterprise research project on Cloud-Based ERP microservices",
      "Published 2 peer-reviewed research papers in IEEE international conferences",
    ],
  },
  {
    degree: "B.Sc. in Information Technology",
    school: "Anna University",
    period: "2013 – 2016",
    badge: { label: "Top 5% Honors", tone: "neutral" as const },
    icon: BookOpen,
    image: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200",
    highlights: [
      "Gained rigorous foundation in Systems Programming, Networking & DB Management",
      "Ranked in top 5% across Software Engineering & Algorithms coursework",
      "Architected campus-wide digital library management system",
      "Organized and chaired annual technical symposium for 3 consecutive years",
    ],
  },
];

export const skills = {
  technical: [
    { name: "React.js / Next.js", level: 95 },
    { name: "Node.js / Express", level: 90 },
    { name: "TypeScript & JavaScript", level: 92 },
    { name: "Database (MongoDB / PostgreSQL)", level: 88 },
    { name: "Cloud (AWS / Azure)", level: 85 },
  ],
  traits: [
    { name: "Leadership", tone: "amber" },
    { name: "Problem Solving", tone: "violet" },
    { name: "Agile Methodologies", tone: "sky" },
    { name: "Mentorship", tone: "rose" },
    { name: "Strategic Thinking", tone: "yellow" },
    { name: "Cross-Team Collaboration", tone: "emerald" },
  ] as const,
  learner: {
    title: "Constant Learner & Tech Pioneer",
    body: "Continuously evolving with cutting-edge AI frameworks, distributed architectures, and modern web design systems.",
  },
};

export const testimonials = [
  {
    quote:
      "Scarlett transformed our completely outdated e-commerce system into an incredibly fast, highly scalable architecture. Our conversion rate increased by 40% after the launch.",
    name: "Sarah Jenkins",
    role: "CTO at InnovateX",
  },
  {
    quote:
      "One of the best engineering minds I've worked with. The dashboard interface was not only flawlessly built, but also incredibly intuitive for non-technical users.",
    name: "David Chen",
    role: "Founder, Peak Analytics",
  },
  {
    quote:
      "Delivered complex fintech integrations reliably and on time. Her attention to detail regarding both security protocols and UX is unparalleled.",
    name: "Maria Rodriguez",
    role: "Product Lead, Fintech Nexus",
  },
];

export const contact = {
  intro:
    "Currently open for new opportunities and exciting collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
};

export const footer = {
  eyebrow: "Innovate & Build",
  signature: "Raj Kumar Sony",
  rotatingRoles: ["UI/UX Architect", "AI Systems Engineer", "Full-Stack Developer"],
};
