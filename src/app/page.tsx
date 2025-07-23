"use client";

import Link from "next/link";
import { useUserData } from "@/lib/useUserData";
import { useCartStore } from "@/lib/cartStore";

export default function Home() {
  const user = useUserData();
  const getItemCount = useCartStore((state) => state.getItemCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {!user && (
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

              {/* 상품 기능 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  🛍️
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  상품
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  다양한 상품들을 둘러보고 구매하세요.
                </p>
                <div className="mt-4 ml-16">
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    상품 보기 →
                  </Link>
                </div>
              </div>

              {/* 프로필 기능 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  👤
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  프로필
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  개인 프로필을 관리하고 활동 내역을 확인하세요.
                </p>
                {user && (
                  <div className="mt-4 ml-16">
                    <Link
                      href="/profile"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      프로필 보기 →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 상태 정보 */}
      {user && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            안녕하세요, {user.full_name || user.email}님!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/posts"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-blue-600">게시판</h4>
              <p className="text-sm text-gray-500">새로운 게시글 확인하기</p>
            </Link>
            <Link
              href="/products"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-blue-600">상품</h4>
              <p className="text-sm text-gray-500">추천 상품 둘러보기</p>
            </Link>
            <Link
              href="/cart"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <h4 className="font-medium text-blue-600">장바구니</h4>
              <p className="text-sm text-gray-500">
                {getItemCount() > 0 ? `${getItemCount()}개 상품` : "상품 담기"}
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
