"use client";

const REVIEWS = [
  {
    id: 1,
    name: "Ahmed Ali",
    initials: "AA",
    color: "#50604A",
    stars: 5,
    text: "Amazing experience! Well-organized bazaars with great products and friendly vendors. Will definitely visit again.",
    location: "Cairo",
  },
  {
    id: 2,
    name: "Sara Mohamed",
    initials: "SM",
    color: "#9A5F4C",
    stars: 5,
    text: "I found amazing deals and the checkout process was super fast. Best marketplace for local bazaars!",
    location: "Alexandria",
  },
  {
    id: 3,
    name: "Youssef Khaled",
    initials: "YK",
    color: "#3a4a7a",
    stars: 4,
    text: "Excellent platform and smooth shopping experience. The variety of brands available is impressive.",
    location: "Giza",
  },
  {
    id: 4,
    name: "Nour Hassan",
    initials: "NH",
    color: "#7a5a2a",
    stars: 5,
    text: "Loved the variety of brands available. The LIVE badge feature is brilliant — I knew exactly what was happening right now!",
    location: "Mansoura",
  },
  {
    id: 5,
    name: "Mariam Tarek",
    initials: "MT",
    color: "#4a2a7a",
    stars: 4,
    text: "Great bazaar events and incredibly friendly vendors. The platform is intuitive and well-designed. Highly recommend!",
    location: "Tanta",
  },
  {
    id: 6,
    name: "Omar Fathy",
    initials: "OF",
    color: "#2a6a5a",
    stars: 5,
    text: "Best online marketplace for local bazaars. The top-notch UI and seamless navigation make it a joy to use every time.",
    location: "Assiut",
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < count ? "#f59e0b" : "none"}
          stroke={i < count ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Quote icon */}
      <div className="text-4xl font-serif leading-none" style={{ color: "#50604A", opacity: 0.25 }}>
        "
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1 -mt-4">
        {review.text}
      </p>

      {/* Stars */}
      <StarRating count={review.stars} />

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        {/* Avatar circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: review.color }}
        >
          {review.initials}
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
          <p className="text-gray-400 text-xs">{review.location}</p>
        </div>

        {/* Verified badge */}
        <span
          className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
          style={{ background: "rgba(80,96,74,0.1)", color: "#50604A" }}
        >
          ✓ Verified
        </span>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <section
      className="w-full px-4 sm:px-6 lg:px-16 py-20"
      style={{ background: "linear-gradient(180deg,#f0f4ee 0%,#fff 100%)" }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(80,96,74,0.1)", color: "#50604A" }}
        >
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          What Customers Say
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Thousands of shoppers trust Bazaar for the best local marketplace experience.
        </p>

        {/* Aggregate rating */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <StarRating count={5} />
          <span className="font-bold text-gray-800 text-sm">4.9</span>
          <span className="text-gray-400 text-sm">/ 5 · 2,300+ reviews</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
