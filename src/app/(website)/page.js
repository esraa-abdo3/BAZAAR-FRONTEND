

import HeroSection from "../components/Herosection/Herosection";
import Livebazaar from "../components/LiveBazar/livebazar";
import Upcomingbazaar from "../components/upcomingbazaar/Upcomingbazaar.jsx";
import Footer from "../components/Footer/Footer";

async function getlivebazar() {
  const res = await fetch(
    "https://bazary-backend.vercel.app/api/events/live",
    {
      cache: "no-store", 
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch live events");
  }

  const data = await res.json();
return data
  
}
async function getupcompingbazaar() {
  const res = await fetch(
    "https://bazary-backend.vercel.app/api/events/upcoming",
    {
      cache: "no-store", 
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch live events");
  }

  const data = await res.json();
return data
  
}
export default  async function Home() {
  const bazars = await getlivebazar();
  const upcomingbazaars = await getupcompingbazaar();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
      <HeroSection />
      <Livebazaar livebazars={bazars} />
      <Upcomingbazaar upcoming={upcomingbazaars} />
 
    </div>
  );
}
