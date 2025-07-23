"use client";

import Link from "next/link";
import { useUserData } from "@/lib/useUserData";
import { useCartStore } from "@/lib/cartStore";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useUserData();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
