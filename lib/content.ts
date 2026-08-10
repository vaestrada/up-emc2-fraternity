export const FOUNDING_YEAR = 1969;

export const site = {
  name: "EMC² Fraternity",
  school: "U.P. College of Engineering",
  university: "University of the Philippines",
  motto: "Engineered for Service.",
  mottoCall: "Take the quantum leap.",
  tagline: "Equality · Service · Brotherhood",
  credo:
    "Equality is our way of life. Loyalty and Obedience, Service and Sacrifice, Courage and Justice.",
  mission:
    "Championing professional and leadership excellence, committed to the service and progress of the Filipino society.",
  about:
    "Founded in 1969 by ten scholars of the University, the EMC² Fraternity is an exclusive Engineering and Physical Sciences brotherhood dedicated to the pursuit of excellence in education and service to the country. Through its years of existence as a fraternal organization based in the College of Engineering, it has distinguished itself through noteworthy endeavors and activities that aimed to uplift the cause and welfare of the University studentry and the community. It has also established itself as a molding ground of student leaders and young exemplars in the fields of Engineering and the Sciences.",
  base: "3rd Floor Lobby, Melchor Hall, U.P. Diliman",
  facebook: "https://www.facebook.com/EMC2Fraternity",
  linkedin: "https://www.linkedin.com/company/up-emc2-fraternity",
};

// The legal entity that receives and acknowledges donations.
// secRegNo is a placeholder until the Association provides the official number.
export const association = {
  legalName: "EMC² Fraternity Alumni Association, Inc.",
  secRegNo: null as string | null, // TODO: official SEC registration number
};

export type Officer = { name: string; role: string; batch?: string };
// Pending — current council to be provided by the Association.
export const officers: Officer[] = [];

export type Memorial = { name: string; batch?: string; years?: string; note?: string };
// Pending — brods to be remembered, to be provided by the Association.
export const inMemoriam: Memorial[] = [];

// The ten founding scholars. Names/notes to be provided from official records.
export type Founder = { name: string; note?: string };
export const founders: Founder[] = [];

// Dated notices (anniversary dinners, elections, calls). Rendered only when
// non-empty — an empty bulletin is worse than none. date is ISO (YYYY-MM-DD).
export type Bulletin = { date: string; title: string; body?: string; href?: string };
export const bulletin: Bulletin[] = [];

// "Why I give" — real donor/alumni quotes. Rendered only when non-empty; do
// not invent quotes. quote is the words; by is the attribution (name · batch).
export type DonorVoice = { quote: string; by: string };
export const donorVoices: DonorVoice[] = [];

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  /** Year or span, e.g. "2020" or "Since 2018". Optional — omitted when unknown. */
  year?: string;
};

export const projects: Project[] = [
  {
    slug: "kalye-tunes",
    title: "Kalye Tunes: UP Fair",
    category: "Arts & Culture",
    description:
      "A live music showcase staged during the annual UP Fair, giving student performers and brods a stage of their own.",
  },
  {
    slug: "mathrix",
    title: "Mathrix: Math Quiz Bee for Freshmen",
    category: "Academics",
    description:
      "A college-wide quiz bee that sharpens incoming Engineering freshmen while spotting the next generation of scholars.",
  },
  {
    slug: "kanalan",
    title: "Kanalan: Bowling Competition for Engineering Organizations",
    category: "Sportsfest",
    description:
      "An inter-organization bowling tournament that brings Engineering student orgs together outside the classroom.",
  },
  {
    slug: "pautakan",
    title: "Pautakan: Quiz Show for Engineering Organizations",
    category: "Academics",
    description:
      "A long-running inter-org quiz show tradition testing wit and teamwork across the College of Engineering.",
  },
  {
    slug: "thinking-space-lounge",
    title: "Thinking Space: Study Lounge at Melchor Hall",
    category: "Campus Welfare",
    description:
      "A dedicated study lounge built for Engineering students inside Melchor Hall, maintained by the brotherhood.",
  },
  {
    slug: "thinking-space-alc",
    title: "Thinking Space Initiatives: Alternative Learning Center",
    category: "Community Outreach",
    description:
      "Brods rolled up their sleeves to renovate a learning center, extending the fraternity's classroom mission beyond UP.",
  },
  {
    slug: "oplan-pag-ibig",
    title: "Oplan Pag-ibig: Outreach Program during Valentines Season",
    category: "Community Outreach",
    description:
      "A Valentine season relief and giving drive bringing goods and time to communities in need.",
  },
  {
    slug: "covid-19-relief",
    title: "COVID-19 Relief Operations",
    category: "Community Outreach",
    year: "2020",
    description:
      "Pandemic-era relief packing and distribution mobilized by the brotherhood for affected communities.",
  },
];

export type Brod = {
  slug: string;
  name: string;
  batch: string;
  honor: string;
  detail: string;
  image: string;
};

export const prominentBrods: Brod[] = [
  {
    slug: "ronaldo-ison",
    name: "Engr. Ronaldo S. “Rannie” Ison",
    batch: "’84-F",
    honor: "Outstanding Structural Engineer",
    detail:
      "Recognized by the Association of Structural Engineers of the Philippines (ASEP) for excellence in structural engineering practice.",
    image: "/photos/brod-ison.jpg",
  },
  {
    slug: "erickson-salanguit",
    name: "Brod Erickson “Son” Salanguit",
    batch: "’03-B",
    honor: "Board of Trustees, UP Alumni Engineers",
    detail:
      "Serving on the 2026 Board of Trustees of the UP Alumni Engineers, carrying the brotherhood's name into University-wide alumni leadership.",
    image: "/photos/brod-salanguit.jpg",
  },
];

export const milestones = [
  {
    year: "1969",
    title: "Founded by Ten Scholars",
    detail:
      "EMC² Fraternity is founded at the U.P. College of Engineering by ten university scholars.",
  },
  {
    year: "1983",
    title: "Most Outstanding Student Organization",
    detail:
      "Adjudged one of the Most Outstanding Student Organizations during U.P.'s Diamond Jubilee year.",
  },
  {
    year: "2020",
    title: "COVID-19 Relief Operations",
    detail:
      "The brotherhood mobilized pandemic relief — packing and distributing goods to communities in need.",
  },
  {
    year: "2024",
    title: "55th Anniversary Celebration",
    detail:
      "Brods across generations gathered at Bahay ng Alumni, U.P. Diliman to mark 55 years of the brotherhood.",
  },
  {
    year: "2026",
    title: "57th Anniversary",
    detail:
      "The brotherhood marks 57 years of Equality, Service, and Brotherhood — and welcomes its first home online.",
  },
];

// /roadmap. "now" = shipped and live; "next" = committed, timing depends on
// an external party (KYB approval, BOT sign-off); "future" = a direction the
// site is built to grow into, not a promised feature or a live product.
export type RoadmapPhase = "now" | "next" | "future";
export type RoadmapItem = {
  phase: RoadmapPhase;
  title: string;
  body: string;
};

export const roadmap: RoadmapItem[] = [
  {
    phase: "now",
    title: "The Member Portal",
    body:
      "Sign in with a magic link, keep your own record current, and find brods who've opted into the directory. Private by default — you choose what's shown and to whom.",
  },
  {
    phase: "now",
    title: "Dues, Recorded Honestly",
    body:
      "No checkout yet, so no pretending there is one. Send your dues, record the reference number, and the Association matches and acknowledges it — the same trust the brotherhood has always run on, now with a paper trail.",
  },
  {
    phase: "next",
    title: "Checkout, Once KYB Clears",
    body:
      "The Association has applied for a PayMongo merchant account. Automated GCash, Maya, and card checkout for dues and gifts goes live the day that business verification is approved — not before.",
  },
  {
    phase: "next",
    title: "The Newsletter",
    body:
      "A periodic dispatch to every brod on record: new citations, upcoming gatherings, the state of ongoing projects. Built on the same Portal record, so it reaches people who actually asked to hear from us.",
  },
  {
    phase: "future",
    title: "A Companion App",
    body:
      "The Portal, in your pocket — push a notice about a gathering, check the directory between meetings, record a dues payment without opening a laptop. A real project once the web Portal has real, daily use behind it.",
  },
  {
    phase: "future",
    title: "An AI-Native Archive",
    body:
      "Ask it who was in a given batch, surface a citation you half-remember, or draft your own update to the brotherhood from a few notes. A copilot over the archive, not a replacement for the brods who keep it.",
  },
];
