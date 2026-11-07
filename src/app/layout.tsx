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
      <body className="relative min-h-full overflow-x-clip bg-background font-sans text-navy">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          >
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] max-w-[1258px] -translate-x-1/2 rounded-full bg-indigo/[0.12] blur-[220px]" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
