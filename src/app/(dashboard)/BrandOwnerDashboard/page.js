"use client";

import { useState, useEffect } from "react";
// axios import removed; using brandService with auth interceptor
import BrandSidebar from "@/app/components/Dashboard/BrandownerDashboard/BrandSidebar";
import BrandHeader from "@/app/components/Dashboard/BrandownerDashboard/BrandHeader";
import BrandOverview from "@/app/components/Dashboard/BrandownerDashboard/BrandOverview";
import BrandOrders from "@/app/components/Dashboard/BrandownerDashboard/BrandOrders";
import BrandOrderDetail from "@/app/components/Dashboard/BrandownerDashboard/BrandOrderDetail";
import BrandProducts from "@/app/components/Dashboard/BrandownerDashboard/BrandProducts";
import BrandAddProduct from "@/app/components/Dashboard/BrandownerDashboard/BrandAddProduct";
import { getBrandProfile, getBrandDashboard, getBrandOrders } from "@/app/services/brandService";
import BrandSettings from "@/app/components/Dashboard/BrandownerDashboard/BrandSettings";
import BrandReviews from "@/app/components/Dashboard/BrandownerDashboard/BrandReviews";
import RoleGuard from "@/app/components/Auth/RoleGuard";

export default function BrandOwnerDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editProduct, setEditProduct] = useState(null); // null = add, object = edit
  const [brandInfo, setBrandInfo] = useState({ id: "", name: "", tagline: "" ,bazaarId:"" });

  // بيانات الداشبورد بقت محفوظة هنا في الأب، مش جوه BrandOverview
  // عشان متتفقدش لما ننتقل بين الصفحات وترجع تاني
  // الأوردرز والإحصائيات منفصلين تمامًا عن الـ AI عشان فشل خدمة الـ AI
  // من ناحية السيرفر ميمنعش ظهور باقي الداشبورد
  const [dashboardState, setDashboardState] = useState({
    dashboard: null,
    orders: [],
    ordersLoading: true,
    ordersError: null,
    aiLoading: true,
    aiError: null,
    loadedOnce: false,
  });

  async function loadDashboardData() {
    setDashboardState((s) => ({
      ...s,
      ordersLoading: true,
      aiLoading: true,
      ordersError: null,
      aiError: null,
    }));

    // الأوردرز مستقلة تمامًا: بتتحمل حتى لو خدمة الـ AI/الداشبورد وقعت
    getBrandOrders()
      .then((ordersRes) => {
        const list = ordersRes?.data?.orders ?? ordersRes?.data ?? ordersRes ?? [];
        setDashboardState((s) => ({
          ...s,
          orders: Array.isArray(list) ? list : [],
          ordersLoading: false,
          ordersError: null,
          loadedOnce: true,
        }));
      })
      .catch((err) => {
        setDashboardState((s) => ({
          ...s,
          ordersLoading: false,
          ordersError: err?.response?.data?.message || err.message || "فشل تحميل الأوردرز",
          loadedOnce: true,
        }));
      });

    // بيانات الداشبورد/الـ AI منفصلة: لو فشلت، الأوردرز فوق بتفضل شغالة عادي
    getBrandDashboard()
      .then((dashboardRes) => {
        setDashboardState((s) => ({
          ...s,
          dashboard: dashboardRes?.data ?? dashboardRes ?? null,
          aiLoading: false,
          aiError: null,
        }));
      })
      .catch((err) => {
        setDashboardState((s) => ({
          ...s,
          dashboard: null,
          aiLoading: false,
          aiError: err?.response?.data?.message || err.message || "فشل تحميل بيانات الداشبورد",
        }));
      });
  }

  useEffect(() => {
    async function loadBrand() {
      try {
        const res = await getBrandProfile();
        const data = res?.data ?? res ?? {};
        console.log("data" , data)
        setBrandInfo({
          id: data._id ?? data.id ?? "",
          name: data.brandName ?? data.name ?? "",
          tagline: data.category ?? "Global Marketplace",
          bazaarId:data.bazaarId
     
        });
      } catch {
        // keep defaults if fetch fails
      }
    }
    loadBrand();
    loadDashboardData(); // بتتحمل مرة واحدة بس عند فتح الداشبورد
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
            dashboard={dashboardState.dashboard}
            orders={dashboardState.orders}
            ordersLoading={dashboardState.ordersLoading}
            ordersError={dashboardState.ordersError}
            aiLoading={dashboardState.aiLoading}
            aiError={dashboardState.aiError}
            onRetry={loadDashboardData}
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
      case "reviews":
        return <BrandReviews brandId={brandInfo.id} />;
      default:
        return (
          <BrandOverview
            dashboard={dashboardState.dashboard}
            orders={dashboardState.orders}
            ordersLoading={dashboardState.ordersLoading}
            ordersError={dashboardState.ordersError}
            aiLoading={dashboardState.aiLoading}
            aiError={dashboardState.aiError}
            onRetry={loadDashboardData}
          />
        );
    }
  }
  console.log("brandInfo",brandInfo)

  return (
    <RoleGuard allowedRoles="BRAND_OWNER">
      <div className="flex min-h-screen bg-gray-50 lg:ml-[220px]">
        <BrandSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          brandName={brandInfo.name}

          brandTagline={brandInfo.tagline}
          brandId={brandInfo.id}
          bazaarId={brandInfo.bazaarId}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <BrandHeader />
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}