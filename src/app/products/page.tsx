"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserData } from "@/app/lib/useUserData";
import { useCartStore, Product } from "@/lib/cartStore";
import { supabase } from "@/lib/supabaseClient";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUserData();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      alert("로그인이 필요합니다!");
      return;
    }
    addItem(product);
    alert(`${product.name}이(가) 장바구니에 추가되었습니다!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">상품을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">상품 목록</h1>
        <p className="text-gray-600">
          다양한 상품들을 둘러보고 마음에 드는 상품을 장바구니에 담아보세요.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">현재 등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 상품 이미지 */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* 상품 정보 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    {product.price.toLocaleString()}원
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!user}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      user
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={!user ? "로그인이 필요합니다" : ""}
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 로그인 안내 */}
      {!user && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            로그인하고 더 많은 기능을 이용하세요
          </h3>
          <p className="text-blue-700 mb-4">
            상품을 장바구니에 담고 주문하려면 로그인이 필요합니다.
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded-md hover:bg-blue-50"
            >
              회원가입
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
