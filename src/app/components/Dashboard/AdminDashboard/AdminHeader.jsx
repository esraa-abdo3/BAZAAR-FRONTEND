"use client";

export default function AdminHeader({ title = "Admin Dashboard" }) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 gap-3">
      <h1 className="text-base font-semibold text-gray-800 whitespace-nowrap flex-shrink-0 lg:ml-0 ml-10">
        {title}
      </h1>
    </header>
  );
}
