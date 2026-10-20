import { DIVE_IN_HEADING, DIVE_IN_STEPS, WHY_ACM_HEADING, WHY_REASONS } from "@/data/content";

// TODO: style to match Figma
export default function WhyAcm() {
  return (
    <section id="why-acm" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>{WHY_ACM_HEADING}</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {WHY_REASONS.map((reason) => (
          <div key={reason.title} className="border p-4">
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
            <a href={reason.href}>{reason.linkLabel}</a>
          </div>
        ))}
      </div>

      <h2 className="mt-10">{DIVE_IN_HEADING}</h2>
      <ol className="list-decimal pl-5">
        {DIVE_IN_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
