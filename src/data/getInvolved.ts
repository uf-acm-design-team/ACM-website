import type { GetInvolvedProps } from "@/app/components/GetInvolved/GetInvolved";

export const GET_INVOLVED: GetInvolvedProps = {
  heading: "Get Involved",
  description:
    "Join our Discord to learn about events, meet other members, and get involved.",
  discord: {
    label: "Join Discord",
    href: "https://discord.com/invite/3HPSwvY8Eb",
  },
  calendar: {
    label: "View calendar",
    // Supply the calendar destination when that page is ready.
    href: null,
  },
  // Replace with { src: "/images/get-involved.jpg", alt: "Describe the photo" }
  // when a club photo is available. Keep faces in the right two-thirds.
  photo: null,
  photoPlaceholderLabel: "Wide club photo",
};
