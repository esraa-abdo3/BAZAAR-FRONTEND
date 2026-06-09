import Sidebar from "../../components/Dashboard/BazarownerDashboard/Sidebar";

export default function BazaarOwnerDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 lg:ml-[220px]">
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
