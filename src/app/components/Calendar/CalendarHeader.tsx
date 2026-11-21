import Image from "next/image";

type CalendarHeaderProps = {
    eyebrow: string;
    heading: string;
    subtitle: string;
};

export default function CalendarHeader({ eyebrow, heading, subtitle }: CalendarHeaderProps) {
    return (
        <header className="flex flex-col gap-5">
          <p className="flex items-center gap-2.5 text-base font-medium leading-6 text-muted">
            <Image src="/icons/bullet-acm-fish.svg" alt="" width={56} height={22} />
            {eyebrow}
          </p>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl leading-[1.25]">{heading}</h1>
            <p className="text-lg leading-[30px] text-muted">{subtitle}</p>
          </div>
          <hr className="border-border" />
        </header>
    );
}