"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Unauthorized from "@/app/components/Auth/Unauthorized";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return <Unauthorized type={reason === "wrong-role" ? "wrong-role" : "no-auth"} />;
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={null}>
      <UnauthorizedContent />
    </Suspense>
  );
}