export type AboutLabelId = "guide" | "prepare" | "engage" | "location";

export type AboutLabel = {
  id: AboutLabelId;
  title: string;
  description: string;
};

export type AboutContent = {
  heading: string;
  body: string;
  bowlAlt: string;
  /** Order matters: it is the reading order on tablet/phone (Guide, Prepare, Engage, Location). */
  labels: AboutLabel[];
};

export const ABOUT: AboutContent = {
  heading: "About ACM",
  body: "UF ACM is the University of Florida chapter of the Association for Computing Machinery. Join workshops, work on projects, and meet other students interested in computing.",
  bowlAlt:
    "Illustration of a glass fishbowl, half filled with blue-to-pink water, with three small white fish swimming inside.",
  labels: [
    {
      id: "guide",
      title: "Guide",
      description:
        "Find your starting point through workshops, shared knowledge, and support from fellow students.",
    },
    {
      id: "prepare",
      title: "Prepare",
      description: "Turn ideas into projects and develop the skills to take your next step.",
    },
    {
      id: "engage",
      title: "Engage",
      description: "Meet a collaborator, join a social, and make the Fishbowl part of your week.",
    },
    {
      id: "location",
      title: "Malachowsky Hall · Room 2100",
      description: "Office hours, projects, and Fishbowl Fridays.",
    },
  ],
};
