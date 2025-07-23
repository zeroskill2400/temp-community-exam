"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/lib/useUserData";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useUserData();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자 상태가 결정될 때까지 잠시 기다림
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, router]);

  // 로딩 중이거나 사용자가 없으면 로딩 표시
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
