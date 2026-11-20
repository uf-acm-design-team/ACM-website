import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UF ACM",
  description:
    "The Association for Computing Machinery at the University of Florida: events, projects and community for students in computing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
    >
      <body className="relative isolate flex min-h-full flex-col overflow-x-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden select-none bg-[url('/background/flow-atlas.svg')] bg-[length:100%_100%] bg-no-repeat md:block"
        />
        {children}
      </body>
    </html>
  );
}
