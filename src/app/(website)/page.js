
import HeroSection from "../components/Herosection/Herosection";
import Livebazaar from "../components/LiveBazar/livebazar";
import Upcomingbazaar from "../components/upcomingbazaar/Upcomingbazaar.jsx";
import WhoAreWe from "../components/Landing/WhoAreWe";
import WhyBazaarsMatter from "../components/Landing/WhyBazaarsMatter";
import HowEveryoneBenefits from "../components/Landing/HowEveryoneBenefits";
import OurStory from "../components/Landing/OurStory";
import PlatformJourney from "../components/Landing/PlatformJourney";
import SpecialOffers from "../components/Landing/SpecialOffers";
import AIFeatures from "../components/Landing/AIFeatures";
import FinalCTA from "../components/Landing/FinalCTA";

async function getlivebazar() {
  const res = await fetch(
    "https://bazary-backend.vercel.app/api/events/live",
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { data: [] };
  }

  return res.json();
}

async function getupcompingbazaar() {
  const res = await fetch(
    "https://bazary-backend.vercel.app/api/events/upcoming",
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { data: [] };
  }

  return res.json();
}

export default async function Home() {
  const bazars = await getlivebazar();
  const upcomingbazaars = await getupcompingbazaar();
  const liveCount = bazars?.data?.length ?? 0;

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans w-full">
      <HeroSection stats={{ bazaars: liveCount || 24 }} />
      <WhoAreWe />
      <WhyBazaarsMatter />
     
      <HowEveryoneBenefits />
         <AIFeatures />
      <OurStory />
          <SpecialOffers />
      <PlatformJourney />
       
      {/* <Livebazaar livebazars={bazars} id="live-bazaars" />
      <Upcomingbazaar upcoming={upcomingbazaars} /> */}
  
  
      <FinalCTA />
    </div>
  );
}
