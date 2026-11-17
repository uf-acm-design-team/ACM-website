import type { GetInvolvedProps } from "@/app/components/GetInvolved/GetInvolved";
import { DISCORD_URL } from "@/data/content";

export const GET_INVOLVED: GetInvolvedProps = {
  heading: "Get Involved",
  description:
    "Join our Discord to learn about events, meet other members, and get involved.",
  discord: {
    label: "Join Discord",
    href: DISCORD_URL,
  },
  calendar: {
    label: "View calendar",
    href: "/calendar",
  },
  // Replace with { src: "/images/get-involved.jpg", alt: "Describe the photo" }
  // when a club photo is available. Keep faces in the right two-thirds.
  photo: null,
  photoPlaceholderLabel: "Wide club photo",
};
