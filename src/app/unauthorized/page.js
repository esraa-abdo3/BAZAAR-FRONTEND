"use client";

import { useSearchParams } from "next/navigation";
import Unauthorized from "@/app/components/Auth/Unauthorized";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason"); 

  return <Unauthorized type={reason === "wrong-role" ? "wrong-role" : "no-auth"} />;
}
