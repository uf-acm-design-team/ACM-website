import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import { FOOTER_SECTION } from "@/data/footer";
import { CHECK_IN_LINK } from "@/data/site";
import {
  CALENDAR_EYEBROW,
  CALENDAR_FILTERS,
  CALENDAR_HEADING,
  CALENDAR_LABELS,
  CALENDAR_SUBTITLE,
  CALENDAR_TYPE_LABELS,
  GOOGLE_CALENDAR_LINK,
  PLACEHOLDER_EVENTS,
} from "@/data/calendar";
import CalendarHeader from "@/app/components/Calendar/CalendarHeader";
import CalendarBoard from "@/app/components/Calendar/CalendarBoard";
import CalendarFootnote from "@/app/components/Calendar/CalendarFootnote";

export const metadata: Metadata = {
  title: "Calendar | UF ACM",
};

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 pt-16 pb-14 md:px-10 lg:px-20">
          <CalendarHeader
            eyebrow={CALENDAR_EYEBROW}
            heading={CALENDAR_HEADING}
            subtitle={CALENDAR_SUBTITLE}
          />
          <CalendarBoard
            events={PLACEHOLDER_EVENTS}
            filters={CALENDAR_FILTERS}
            labels={CALENDAR_LABELS}
            typeLabels={CALENDAR_TYPE_LABELS}
            checkInHref={CHECK_IN_LINK.href}
          />
          <CalendarFootnote link={GOOGLE_CALENDAR_LINK} newTabLabel={CALENDAR_LABELS.newTab} />
        </div>
      </main>
      <Footer {...FOOTER_SECTION} />
    </>
  );
}
