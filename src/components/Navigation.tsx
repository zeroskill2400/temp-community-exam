"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserData } from "@/lib/useUserData";

export default function Navigation() {
  const pathname = usePathname();
  const user = useUserData();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/posts", label: "게시판" },
    { href: "/products", label: "상품" },
  ];

  const userNavItems = user
    ? [
        { href: "/cart", label: "장바구니" },
        { href: "/profile", label: "프로필" },
      ]
    : [];

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {[...navItems, ...userNavItems].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-4 px-2 border-b-2 ${
                isActive(item.href)
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
