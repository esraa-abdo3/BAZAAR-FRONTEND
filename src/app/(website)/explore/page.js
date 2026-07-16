import AnnouncementBar from "@/app/components/Explore/AnnouncementBar";
import ExploreHero from "@/app/components/Explore/ExploreHero";
import ExploreLiveBazaars from "@/app/components/Explore/ExploreLiveBazaars";
import ExploreUpcoming from "@/app/components/Explore/ExploreUpcoming";
import TopProducts from "@/app/components/Explore/TopProducts";
import CustomerReviews from "@/app/components/Explore/CustomerReviews";
import JoinUsCTA from "@/app/components/Explore/JoinUsCTA";

export const metadata = {
  title: "Explore Bazaars | Bazaar — Discover Amazing Deals",
  description:
    "Explore live events, upcoming bazaars, and top trending products on Bazaar — Egypt's #1 local marketplace platform.",
};

async function getLiveBazaars() {
  try {
    const res = await fetch(
      "https://bazary-backend.vercel.app/api/events/live",
      { cache: "no-store" }
    );
    if (!res.ok) return { data: [] };
    return res.json();
  } catch {
    return { data: [] };
  }
}

async function getUpcomingBazaars() {
  try {
    const res = await fetch(
      "https://bazary-backend.vercel.app/api/events/upcoming",
      { cache: "no-store" }
    );
    if (!res.ok) return { data: [] };
    return res.json();
  } catch {
    return { data: [] };
  }
}

export default async function ExplorePage() {
  const [livebazars, upcomingbazaars] = await Promise.all([
    getLiveBazaars(),
    getUpcomingBazaars(),
  ]);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Scrolling announcement ticker */}
      <AnnouncementBar />

      {/* 2. Hero section */}
      <ExploreHero />

      {/* 3. Live Bazaars — existing component, UI-only wrapper */}
      <ExploreLiveBazaars livebazars={livebazars} />
      <JoinUsCTA/>

      {/* 3b. Upcoming Bazaars — existing component, UI-only wrapper */}
      <ExploreUpcoming upcoming={upcomingbazaars} />

      {/* 4. Top Products — client component with API + skeleton + fallback */}
      <TopProducts />

      {/* 5. Customer Reviews — static data */}
      <CustomerReviews />
    </div>
  );
}
