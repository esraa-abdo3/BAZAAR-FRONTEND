import Navbar from "../components/Navbar/Navbar";

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
