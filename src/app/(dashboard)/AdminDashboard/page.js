"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/Dashboard/AdminDashboard/AdminSidebar";
import AdminHeader from "@/app/components/Dashboard/AdminDashboard/AdminHeader";
import AdminOverview from "@/app/components/Dashboard/AdminDashboard/AdminOverview";
import AdminBazaars from "@/app/components/Dashboard/AdminDashboard/AdminBazaars";
import AdminBrands from "@/app/components/Dashboard/AdminDashboard/AdminBrands";
import AdminUsers from "@/app/components/Dashboard/AdminDashboard/AdminUsers";
import AdminProducts from "@/app/components/Dashboard/AdminDashboard/AdminProducts";
import AdminOrders from "@/app/components/Dashboard/AdminDashboard/AdminOrders";
import AdminSettings from "@/app/components/Dashboard/AdminDashboard/AdminSettings";

const pageTitles = {
  overview: "Dashboard Overview",
  bazaars: "Bazaars Management",
  brands: "Brands Management",
  users: "Users Management",
  products: "Products Catalog",
  orders: "Orders Log",
  settings: "Platform Settings",
};

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");

  function renderPage() {
    switch (activePage) {
      case "overview":
        return <AdminOverview />;
      case "bazaars":
        return <AdminBazaars />;
      case "brands":
        return <AdminBrands />;
      case "users":
        return <AdminUsers />;
      case "products":
        return <AdminProducts />;
      case "orders":
        return <AdminOrders />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* Sidebar */}
      <AdminSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <AdminHeader title={pageTitles[activePage] || "Admin Dashboard"} />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
