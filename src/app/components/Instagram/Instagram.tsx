import Image from "next/image";
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS, INSTAGRAM_URL } from "@/data/content";

// TODO: style to match Figma
export default function Instagram() {
  return (
    <section id="instagram" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2 className="py-4">{INSTAGRAM_HANDLE}</h2>

      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="border px-4 py-2">
        Follow Us On Instagram
      </a>

      <ul className="mt-6 flex flex-wrap gap-6">
        {INSTAGRAM_POSTS.map((post) => (
          <li key={post.id} className="border p-4">
            {post.image ? (
              <Image src={post.image} alt={post.alt} width={160} height={160} />
            ) : (
              // Placeholder until post images are added
              <div className="h-40 w-40 bg-accent" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
