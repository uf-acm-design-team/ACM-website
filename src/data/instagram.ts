import type { StaticImageData } from "next/image";
// Avatar exported from Figma (UF ACM / Instagram avatar, 150×150).
import avatar from "@/app/components/Instagram/avatar.png";

export type InstagramPost = {
  id: string;
  /** Permalink to the post on Instagram. */
  href: string;
  alt: string;
  /** Image URL or static import. Undefined → the placeholder tile is rendered. */
  image?: string | StaticImageData;
};

export type InstagramProfile = {
  name: string;
  handle: string;
  subtitle: string;
  profileUrl: string;
  /** Image URL or static import. Undefined → a plain colored circle is rendered. */
  avatar?: string | StaticImageData;
};

export type InstagramContent = {
  heading: string;
  subtext: string;
  followLabel: string;
  /** Shown on post tiles that have no image yet. */
  placeholderLabel: string;
  /** Shown under the posts on touch-size screens instead of the arrows. */
  swipeHint: string;
  previousLabel: string;
  nextLabel: string;
  profile: InstagramProfile;
  posts: InstagramPost[];
};

const PROFILE_URL = "https://www.instagram.com/uf.acm/";

const PLACEHOLDER_POSTS: InstagramPost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `post-${i + 1}`,
  href: PROFILE_URL,
  alt: `UF ACM Instagram post ${i + 1}`,
}));

/**
 * Returns the Instagram section content.
 *
 * Sprint 5: replace this body with the real fetch (keep the signature and return shape), and
 * add the Instagram CDN host to `images.remotePatterns` in next.config.ts. The component does
 * not need to change.
 */
export async function getInstagram(): Promise<InstagramContent> {
  return {
    heading: "Follow Us on Instagram",
    subtext: "Photos and updates from UF ACM.",
    followLabel: "Follow",
    placeholderLabel: "Placeholder image",
    swipeHint: "Swipe to explore",
    previousLabel: "Previous posts",
    nextLabel: "Next posts",
    profile: {
      name: "UF ACM",
      handle: "uf.acm",
      subtitle: "University of Florida",
      profileUrl: PROFILE_URL,
      avatar,
    },
    posts: PLACEHOLDER_POSTS,
  };
}
