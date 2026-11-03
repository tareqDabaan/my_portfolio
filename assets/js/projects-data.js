/**
 * Content for the project details page (project.html?id=<id>).
 *
 * To add a project:
 *   1. Add an entry to this list (the order here is the Previous/Next order on the details page).
 *   2. Add a matching card in the Projects section of index.html that links to project.html?id=<id>.
 *
 * Fields:
 *   id            URL id used in project.html?id=...
 *   title         Project name
 *   client        Client or owner (shown above the title and in the info box; optional)
 *   eyebrow       Text shown above the title instead of the client (optional)
 *   icon          Bootstrap Icons name (without the "bi-" prefix)
 *   type          "Professional", "Personal" or "Freelance"
 *   role          Your role on the project
 *   company       Company you delivered it through (optional)
 *   period        Dates (optional)
 *   overview      One or two short paragraphs (array of strings)
 *   highlights    Key numbers or facts (optional): [{ value, label }]
 *   contributions What you did (array of strings)
 *   tech          Technologies used (array of strings)
 *   link          External link (optional): { url, label }
 *   video         Demo video (optional): { src, poster, caption }
 *                 src/poster are paths inside this repo, e.g. "assets/video/name.mp4"
 */
window.PROJECTS = [
  {
    id: "hr-ai-assistant",
    title: "AI-Powered HR Assistant",
    eyebrow: "SUHOB \u00b7 Proof of concept",
    icon: "robot",
    type: "Professional (proof of concept)",
    role: ".NET Backend Developer",
    company: "SUHOB Integrated Computer Solutions",
    overview: [
      "A bilingual (English and Arabic) HR assistant for employees. An employee types or speaks a request in the mobile app, such as booking sick leave, checking this month's attendance or asking about a company policy. An AI agent understands the request and calls the backend to apply the real HR rules, then answers by text or by voice. Policy answers cite the company document and page they came from.",
      "I designed and built the .NET 9 backend: the security and business-rules layer between the Flutter app and the LangChain AI agent. The AI decides what the user is asking for; the backend decides who the user is (from their Microsoft Entra ID token) and whether they are allowed (from the HR rules and roles in the database). The AI agent, the mobile app and the Azure setup were built by teammates, and I integrated with all three."
    ],
    highlights: [
      { value: "~15", label: "API endpoints, plus an admin portal and 9 SQL tables" },
      { value: "Text & voice", label: "Real-time chat and speech-to-speech, in English and Arabic" },
      { value: "~300", label: "Automated checks across 4 test suites" }
    ],
    contributions: [
      "Implemented Microsoft Entra ID authentication with two separate schemes on one app registration: JWT Bearer for the mobile app and the AI agent, and OpenID Connect with cookies for the admin portal",
      "Built database-backed role-based access control (Employee, Approver, Admin) checked on every request, so role changes apply immediately and are audit-logged; the agent's tool calls reuse the user's own token, so the AI can never act beyond the user's permissions",
      "Built a WebSocket chat endpoint that streams the agent's answer token by token by relaying its Server-Sent Events stream, with server-owned, resumable conversations and every message saved",
      "Built a bidirectional WebSocket voice relay to the AI team's real-time voice service (Azure OpenAI real-time), streaming audio both ways with secrets added server-side, one live session per user, retry with backoff and keep-alive",
      "Added English/Arabic speech-to-text with Azure AI Speech and Azure Blob Storage, and diagnosed and fixed production failures from server logs",
      "Implemented concurrency-safe leave management (balances, pending reservations and an approval workflow), with a row-level lock so two simultaneous requests can't both pass the balance check",
      "Built the attendance API for the agent's tools, with team-based data scoping, per-user rate limiting, audit logging and bilingual fuzzy name search that normalizes Arabic spelling variants",
      "Integrated the agent's retrieval-augmented generation (RAG) citations: relayed sources to the app in real time, saved them with each answer, issued fresh time-limited links on demand, and built an admin library for the documents the AI answers from",
      "Wrote 4 automated test suites (~300 checks) with a mock AI agent, plus Postman collections and the API documentation the mobile and AI teams built against"
    ],
    tech: [".NET 9", "ASP.NET Core", "Razor Pages", "Microsoft Entra ID", "OpenID Connect", "JWT", "WebSockets", "Server-Sent Events", "SQL", "Azure AI Speech", "Azure Blob Storage", "RAG integration"]
  },
  {
    id: "moh",
    title: "KPI Data Entry & Data Warehouse Integration",
    client: "Ministry of Health, Kuwait",
    icon: "hospital",
    type: "Professional",
    role: "Software Engineer",
    company: "SUHOB Integrated Computer Solutions",
    overview: [
      "The Ministry of Health in Kuwait follows its key performance indicators through Qlik dashboards. I worked on the system that feeds them: a custom control panel for KPI data entry, the data warehouse behind the dashboards, and the HL7 integration layer that moves clinical messages between hospitals across Kuwait."
    ],
    highlights: [
      { value: "15 min", label: "Data refresh cycle, keeping dashboards near real-time" },
      { value: "HL7 v2", label: "Message routing for interoperability across all Kuwait hospitals" },
      { value: "Azure OCR", label: "AI-assisted KPI data entry" }
    ],
    contributions: [
      "Developed a custom ASP.NET control panel for KPI data entry with AI integration (Azure OCR), feeding the Qlik dashboards used by the Ministry of Health",
      "Contributed to building and maintaining the data warehouse behind the dashboards; created SSIS packages to extract, transform, and load data from multiple sources, including an Oracle database and the KPI control panel",
      "Designed and scheduled automated SQL Server jobs that refresh data every 15 minutes, keeping dashboards near real-time",
      "Developed and configured Mirth Connect channels to process, transform, and route HL7 v2 messages for interoperability across all Kuwait hospitals",
      "Implemented JavaScript transformers to parse HL7 segments (MSH, PID, PV1, AIS, SCH, NTE, OBX) and extract clinical and administrative data, with encryption and decryption inside the channels for secure end-to-end communication"
    ],
    tech: ["ASP.NET", "Azure OCR", "SSIS", "SQL Server", "Oracle", "Qlik", "Mirth Connect", "HL7 v2", "JavaScript"]
  },
  {
    id: "puc",
    title: "Student Registration & Scholarship Platform",
    client: "Private Universities Council (PUC), Kuwait",
    icon: "mortarboard",
    type: "Professional",
    role: "Software Engineer",
    company: "SUHOB Integrated Computer Solutions",
    overview: [
      "The Private Universities Council runs the platform where students in Kuwait apply for scholarship plans at private universities, with around 12,000 applicants every admission cycle. I developed and maintained features in this microservices-based ASP.NET Core platform, from new plan types to the admin review interface."
    ],
    highlights: [
      { value: "~12,000", label: "Students applying per admission cycle" },
      { value: "GPA-ranked", label: "Seat allocation per major" },
      { value: "Arabic RTL", label: "Redesigned admin application-review interface" }
    ],
    contributions: [
      "Developed and maintained features in a microservices-based ASP.NET Core platform where around 12,000 students per admission cycle apply for scholarship plans at private universities",
      "Implemented a new plan type (private funding) by extending the application workflow: eligibility rules, university and major selection, and document upload",
      "Tested and validated the seat-allocation process that ranks applicants by GPA and assigns seats per major, using SQL Server stored procedures",
      "Worked with the PACI (Kuwait Mobile ID) authentication service integration and documented registration eligibility rules for the project manager",
      "Configured and published admission plans each cycle, and redesigned the admin application-review interface (Arabic, RTL)"
    ],
    tech: ["ASP.NET Core", "Microservices", "SQL Server", "Stored Procedures", "PACI Mobile ID", "RTL UI"]
  },
  {
    id: "ncsc",
    title: "Vulnerability & Incident Reporting Platform",
    client: "National Cyber Security Center, State of Kuwait",
    icon: "shield-lock",
    type: "Professional",
    role: "Software Engineer",
    company: "SUHOB Integrated Computer Solutions",
    overview: [
      "A custom platform for the National Cyber Security Center of the State of Kuwait to receive and manage vulnerability and incident reports. I architected and implemented it, including access control, notifications and status tracking so every report is handled efficiently."
    ],
    highlights: [
      { value: "4", label: "Distinct user types with granular permissions" },
      { value: "Automated", label: "Email notifications and status tracking" }
    ],
    contributions: [
      "Architected and implemented a custom vulnerability and incident reporting platform",
      "Implemented a role-based access control system with four distinct user types and granular permissions",
      "Integrated automated email notifications and status tracking to ensure efficient handling of reports"
    ],
    tech: ["System Architecture", "RBAC", "Email Notifications", "Status Tracking"]
  },
  {
    id: "moe-gis",
    title: "GIS Mapping Platform",
    client: "Ministry of Education, Kuwait",
    icon: "geo-alt",
    type: "Professional",
    role: "Software Engineer",
    company: "SUHOB Integrated Computer Solutions",
    overview: [
      "A large-scale GIS platform the Ministry of Education uses to map schools and centers. I designed the APIs for the mobile app and the core business logic behind the mapping services, and moved existing APIs to a cleaner architecture without breaking anything already in production."
    ],
    highlights: [
      { value: "Backward-compatible", label: "Legacy routes and response formats preserved in production" },
      { value: "PostGIS", label: "Geospatial queries for boundaries, map pins and filtering" }
    ],
    contributions: [
      "Designed APIs for the mobile app and core business logic for school and center mapping services on a large-scale GIS platform",
      "Refactored and enhanced existing APIs into a cleaner layered architecture while preserving legacy routes and response formats for production compatibility",
      "Integrated PostgreSQL/PostGIS queries to handle geospatial data, facility boundaries, map pins, and location-based filtering"
    ],
    tech: ["REST APIs", "Layered Architecture", "PostgreSQL", "PostGIS", "GIS"],
    video: {
      src: "assets/video/moe-gis-demo.mp4",
      poster: "assets/img/moe-gis-demo-poster.jpg",
      caption: "A short preview of the feature I worked on in the Ministry of Education mobile app: searching the educational facilities map, filtering schools by education level and district, viewing statistics per educational district, and browsing facilities on the map."
    }
  },
  {
    id: "medsal",
    title: "MedSal – Healthcare Platform",
    client: "Remostart",
    icon: "heart-pulse",
    type: "Professional",
    role: "Backend Developer Intern",
    company: "Remostart",
    period: "Aug 2023 – Aug 2024",
    overview: [
      "A web and mobile platform that connects patients with healthcare providers, including doctors and pharmacies, in the UAE. It was built by a team of four developers; I designed and implemented the database and the RESTful APIs behind it."
    ],
    highlights: [
      { value: "4", label: "Developers on the team" },
      { value: "UAE", label: "Patients connected with doctors and pharmacies" }
    ],
    contributions: [
      "Designed and implemented a secure, scalable PostgreSQL database and robust RESTful APIs using Python, Django, and Django REST Framework",
      "Optimized backend architecture and API performance for a seamless user experience",
      "Handled geospatial data with GeoDjango and PostGIS",
      "Tested APIs with Postman and used Git and Docker in the development workflow"
    ],
    tech: ["Python", "Django", "Django REST Framework", "GeoDjango", "PostgreSQL", "PostGIS", "Docker", "Postman", "Git"],
    link: { url: "https://documenter.getpostman.com/view/26438410/2s9YeLX9QZ", label: "View API documentation" }
  },
  {
    id: "waba-shopify",
    title: "Shopify Store & Smart Cart",
    client: "WABA International Commercial Company",
    icon: "cart-check",
    type: "Professional",
    role: "Web Developer",
    company: "WABA International Commercial Company",
    period: "Dec 2024 – Apr 2025",
    overview: [
      "WABA International sells online through a Shopify e-commerce store. I developed new features and provided ongoing support for the store, and wrote scripts that collect data for the team's analytics."
    ],
    contributions: [
      "Developed features and provided ongoing support for the company's Shopify e-commerce store using Liquid, HTML, and CSS",
      "Built a smart cart feature that shows customers product recommendations directly in the cart",
      "Wrote Python web-scraping scripts to collect data for analytics"
    ],
    tech: ["Shopify", "Liquid", "HTML", "CSS", "Python", "Web Scraping"],
    link: { url: "https://shopwaba.com/", label: "Visit website" }
  },
  {
    id: "syrian-adventurer",
    title: "Syrian Adventurer Association",
    client: "Personal project",
    icon: "compass",
    type: "Personal",
    role: "Developer",
    overview: [
      "A system for an adventurer association focused on mountain activities. Admins get a dashboard with AI algorithms that recommend the best activities to create, and users get a friendly interface to browse and book them."
    ],
    contributions: [
      "Built an admin dashboard with AI algorithms that recommend the best activities for the admin to create",
      "Delivered a user-friendly interface for users to browse and book activities",
      "Designed a secure and scalable PostgreSQL database with PostGIS for location data",
      "Built robust RESTful APIs with Python Django and Django REST Framework, with an optimized backend architecture"
    ],
    tech: ["Python", "Django", "Django REST Framework", "PostgreSQL", "PostGIS", "React"],
    link: { url: "https://github.com/tareqDabaan/Syrian_Adventurer_Association", label: "View on GitHub" }
  },
  {
    id: "amaratlines",
    title: "Amaratlines Website",
    client: "Freelance",
    icon: "buildings",
    type: "Freelance",
    role: "Web Developer",
    overview: [
      "A static website that showcases a Kuwaiti construction company's expertise and services, with a clean, user-friendly interface that makes it easy for visitors to learn about the company and its work."
    ],
    contributions: [
      "Built sections covering the company's history, mission and areas of specialization",
      "Highlighted the construction services offered, such as commercial and residential projects, infrastructure development, and project management",
      "Created a portfolio section showcasing the company's past and ongoing projects across sectors"
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    link: { url: "https://amaratlines.com/", label: "Visit website" }
  }
];
