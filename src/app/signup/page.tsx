"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";
import { useUserData } from "@/app/lib/useUserData";

export default function SignUpPage() {
  const { user, isLoading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되었고 사용자가 있으면 리디렉션
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // 로딩 중일 때는 로딩 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 이미 로그인되어 있으면 리디렉션 중 표시
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">리디렉션 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  );
}
