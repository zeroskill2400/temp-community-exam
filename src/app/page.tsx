"use client";

import Link from "next/link";
import { useUserData } from "@/app/lib/useUserData";
import { useCartStore } from "@/lib/cartStore";

export default function Home() {
  const { user, isLoading } = useUserData();
  const getItemCount = useCartStore((state) => state.getItemCount);

  // 임시 디버깅 함수
  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 임시 디버깅 버튼 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={clearLocalStorage}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
        >
          캐시 초기화
        </button>
      </div>

      {/* 히어로 섹션 */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Next.js 커뮤니티에
          <span className="text-blue-600"> 오신 것을 환영합니다</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          최신 웹 기술을 활용한 현대적인 커뮤니티 플랫폼입니다. 게시글을
          공유하고, 상품을 구매하며, 다른 사용자들과 소통해보세요.
        </p>

        {!isLoading && !user && (
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                시작하기
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                로그인
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 기능 소개 카드 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              기능
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              더 나은 커뮤니티 경험을 위해
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* 게시판 기능 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  📝
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  게시판
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  자유롭게 게시글을 작성하고 다른 사용자들과 소통하세요.
                </p>
                <div className="mt-4 ml-16">
                  <Link
                    href="/posts"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    게시판 보기 →
                  </Link>
                </div>
              </div>

              {/* 쇼핑 기능 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  🛒
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  상품
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  다양한 상품을 둘러보고 장바구니에 담아 구매하세요.
                </p>
                <div className="mt-4 ml-16">
                  <Link
                    href="/products"
                    className="text-green-600 hover:text-green-500"
                  >
                    상품 보기 →
                  </Link>
                </div>
              </div>

              {/* 장바구니 기능 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  🛍️
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  장바구니 ({getItemCount()})
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  마음에 드는 상품을 장바구니에 담고 편리하게 관리하세요.
                </p>
                <div className="mt-4 ml-16">
                  <Link
                    href="/cart"
                    className="text-purple-600 hover:text-purple-500"
                  >
                    장바구니 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 상태 정보 */}
      {!isLoading && user && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            안녕하세요, {user.user_metadata?.full_name || user.email}님!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/posts"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-blue-600">게시판</h4>
              <p className="text-sm text-gray-500 mt-1">
                게시글을 작성하고 확인하세요
              </p>
            </Link>
            <Link
              href="/products"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-green-600">상품</h4>
              <p className="text-sm text-gray-500 mt-1">
                다양한 상품을 둘러보세요
              </p>
            </Link>
            <Link
              href="/profile"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-purple-600">프로필</h4>
              <p className="text-sm text-gray-500 mt-1">
                회원 정보를 관리하세요
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
