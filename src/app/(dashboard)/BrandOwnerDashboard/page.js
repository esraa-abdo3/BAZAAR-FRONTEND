"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BrandSidebar from "@/app/components/Dashboard/BrandownerDashboard/BrandSidebar";
import BrandHeader from "@/app/components/Dashboard/BrandownerDashboard/BrandHeader";
import BrandOverview from "@/app/components/Dashboard/BrandownerDashboard/BrandOverview";
import BrandOrders from "@/app/components/Dashboard/BrandownerDashboard/BrandOrders";
import BrandOrderDetail from "@/app/components/Dashboard/BrandownerDashboard/BrandOrderDetail";
import BrandProducts from "@/app/components/Dashboard/BrandownerDashboard/BrandProducts";
import BrandAddProduct from "@/app/components/Dashboard/BrandownerDashboard/BrandAddProduct";
import BrandSettings from "@/app/components/Dashboard/BrandownerDashboard/BrandSettings";

export default function BrandOwnerDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editProduct, setEditProduct] = useState(null); 
  const [brandInfo, setBrandInfo] = useState({ name: "", tagline: "" });

  useEffect(() => {
    async function loadBrand() {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await axios.get(
          "https://bazary-backend.vercel.app/api/brand",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        const data = res.data?.data ?? res.data ?? {};
        setBrandInfo({
          name: data.brandName ?? data.name ?? "",
          tagline: data.category ?? "Global Marketplace",
        });
      } catch {
        // keep defaults if fetch fails
      }
    }
    loadBrand();
  }, []);

  function renderPage() {
    if (activePage === "order-detail")
      return (
        <BrandOrderDetail
          order={selectedOrder}
          onBack={() => setActivePage("orders")}
        />
      );
    if (activePage === "add-product")
      return (
        <BrandAddProduct
          product={editProduct}
          onBack={() => setActivePage("products")}
          onSuccess={() => setActivePage("products")}
        />
      );

    switch (activePage) {
      case "overview":
        return (
          <BrandOverview
            onViewOrders={() => setActivePage("orders")}
            onViewProducts={() => setActivePage("products")}
          />
        );
      case "orders":
        return (
          <BrandOrders
            onViewDetail={(order) => {
              setSelectedOrder(order);
              setActivePage("order-detail");
            }}
          />
        );
      case "products":
        return (
          <BrandProducts
            onAddNew={() => {
              setEditProduct(null);
              setActivePage("add-product");
            }}
            onEdit={(product) => {
              setEditProduct(product);
              setActivePage("add-product");
            }}
          />
        );
      case "settings":
        return <BrandSettings />;
      default:
        return <BrandOverview />;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      <BrandSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        brandName={brandInfo.name}
        brandTagline={brandInfo.tagline}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <BrandHeader />
        <main className="flex-1 overflow-auto p-8">{renderPage()}</main>
      </div>
    </div>
  );
}
