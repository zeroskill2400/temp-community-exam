"use client";

import Link from "next/link";
import { useUserData } from "@/app/lib/useUserData";
import { useCartStore } from "@/lib/cartStore";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isLoading, clearUser } = useUserData();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const router = useRouter();

  const handleLogout = async () => {
    // 먼저 로컬 상태를 초기화
    clearUser();

    // Supabase 로그아웃
    await supabase.auth.signOut();

    // 페이지 새로고침
    router.push("/");
    router.refresh();
  };

  // 로딩 중일 때는 아무것도 표시하지 않거나 로딩 상태를 표시
  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Community
            </Link>
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Community
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/posts" className="text-gray-700 hover:text-gray-900">
              게시판
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900"
            >
              상품
            </Link>

            {user ? (
              <>
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-gray-900 relative"
                >
                  장바구니{" "}
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  프로필
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
