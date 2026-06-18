"use client";

const MESSAGES = [
  "🔥 Subscribe now & enjoy exclusive offers",
  "🛍️ Buy now and get special discounts",
  "⭐ Best deals available today",
  "🚀 Join bazaars and explore trending products",
  "🔥 Subscribe now & enjoy exclusive offers",
  "🛍️ Buy now and get special discounts",
  "⭐ Best deals available today",
  "🚀 Join bazaars and explore trending products",
];

export default function AnnouncementBar() {
  return (
    <div
      className="w-full bg-black text-white overflow-hidden"
      style={{ height: "40px" }}
      aria-label="Announcements"
    >
      <div className="flex items-center h-full">
        <div className="ticker-track flex items-center gap-0 whitespace-nowrap">
          {MESSAGES.map((msg, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-sm font-medium px-12"
            >
              {msg}
              <span className="text-white/30 ml-8">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
