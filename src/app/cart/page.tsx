"use client";

import { useUserData } from "@/lib/useUserData";
import { useCartStore } from "@/lib/cartStore";
import PrivateRoute from "@/components/PrivateRoute";
import Link from "next/link";

export default function CartPage() {
  const user = useUserData();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert("결제 기능은 현재 구현 중입니다!");
  };

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">장바구니</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              전체 삭제
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              장바구니가 비어있습니다
            </h3>
            <p className="text-gray-500 mb-6">
              상품을 둘러보고 마음에 드는 상품을 장바구니에 담아보세요.
            </p>
            <Link
              href="/products"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 장바구니 아이템 목록 */}
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* 상품 이미지 */}
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.product.description}
                    </p>
                    <p className="text-blue-600 font-medium mt-2">
                      {item.product.price.toLocaleString()}원
                    </p>
                  </div>

                  {/* 수량 조절 */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  {/* 소계 */}
                  <div className="text-right ml-6">
                    <p className="text-lg font-semibold text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-1"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문 요약 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                주문 요약
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 개수</span>
                  <span className="font-medium">{getItemCount()}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">
                    {getTotal().toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-medium">무료</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>총 결제 금액</span>
                    <span className="text-blue-600">
                      {getTotal().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 font-medium"
              >
                주문하기
              </button>
            </div>

            {/* 계속 쇼핑하기 */}
            <div className="text-center">
              <Link
                href="/products"
                className="text-blue-500 hover:text-blue-600"
              >
                ← 계속 쇼핑하기
              </Link>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
