const STEPS = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "We visit your Calgary property, discuss your vision, and take exact measurements — no cost, no commitment.",
  },
  {
    number: "02",
    title: "Custom Quote",
    description:
      "Receive a detailed, transparent quote within 24–48 hours. No hidden fees. We guide you through any Calgary permit requirements.",
  },
  {
    number: "03",
    title: "Expert Installation",
    description:
      "Our crew arrives on time, works clean, and keeps you updated. Every project is built to Calgary's weather and code standards.",
  },
  {
    number: "04",
    title: "Final Walkthrough",
    description:
      "We review every detail together before we pack up. You don't sign off until you're completely satisfied.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#f8fbf8]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-2 border-[#477a40] pb-2 inline-block">
            Our Simple Process
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-500 font-light">
            From first call to final walkthrough — straightforward every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              {/* Step number */}
              <span className="text-5xl font-black text-[#477a40]/15 leading-none select-none">
                {step.number}
              </span>

              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-[#477a40]/30" />
              )}

              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
