const AREAS = [
  { label: "NW Calgary",  suburbs: "Tuscany, Scenic Acres, Royal Oak, Varsity" },
  { label: "NE Calgary",  suburbs: "Martindale, Skyview, Saddle Ridge, Coral Springs" },
  { label: "SW Calgary",  suburbs: "Signal Hill, Evergreen, Bridlewood, Shawnessy" },
  { label: "SE Calgary",  suburbs: "McKenzie Lake, Auburn Bay, Copperfield, Mahogany" },
  { label: "Airdrie",     suburbs: "Bayview, Cooper's Crossing, Hillcrest" },
  { label: "Cochrane",    suburbs: "Heartland, Riviera, Sunset Ridge" },
  { label: "Chestermere", suburbs: "Waterside, Rainbow Falls, Westmere" },
  { label: "Okotoks",     suburbs: "D'Arcy Ranch, Air Ranch, Crystal Shores" },
];

export default function ServiceArea() {
  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-2 border-[#477a40] pb-2 inline-block">
            Serving All of Calgary &amp; Area
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-500 font-light">
            From NW to SE and beyond — we bring professional landscaping to your neighbourhood.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AREAS.map((area) => (
            <div
              key={area.label}
              className="rounded-2xl border border-[#477a40]/20 bg-[#f8fbf8] p-4 hover:border-[#477a40]/60 hover:shadow-sm transition-all"
            >
              <p className="font-bold text-[#477a40] text-sm">{area.label}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{area.suburbs}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t see your area? <a href="/contact" className="text-[#477a40] font-medium hover:underline underline-offset-2">Contact us</a> — we likely service it.
        </p>
      </div>
    </section>
  );
}
