import type { Metadata } from "next";
import {
  Host_Grotesk,
  JetBrains_Mono,
  Poppins,
} from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins-loaded",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      className={`${hostGrotesk.variable} ${poppins.variable} ${jetBrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="relative min-h-full overflow-x-clip bg-background font-sans text-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          >
          <div className="absolute inset-y-0 left-1/2 w-[calc(100%-2rem)] max-w-[1258px] -translate-x-1/2 rounded-full bg-panel/[0.12] blur-[220px]" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
