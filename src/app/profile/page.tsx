"use client";

import { useState } from "react";
import { useUserData } from "@/lib/useUserData";
import { supabase } from "@/lib/supabaseClient";
import PrivateRoute from "@/components/PrivateRoute";

export default function ProfilePage() {
  const user = useUserData();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;

      setMessage("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error: any) {
      setMessage(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      await supabase.auth.signOut();
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">프로필</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            계정 정보
          </h2>

          {message && (
            <div
              className={`p-4 rounded-md mb-4 ${
                message.includes("오류")
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-green-100 border border-green-400 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                이메일은 변경할 수 없습니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가입일
              </label>
              <p className="text-gray-600">
                {user
                  ? new Date(user.id.split("-")[0]).toLocaleDateString("ko-KR")
                  : ""}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "업데이트 중..." : "프로필 업데이트"}
            </button>
          </form>
        </div>

        {/* 활동 통계 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            활동 통계
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">작성한 게시글</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">작성한 댓글</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">구매한 상품</p>
            </div>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            계정 관리
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">비밀번호 변경</h3>
                <p className="text-sm text-gray-500">
                  계정 보안을 위해 정기적으로 비밀번호를 변경하세요.
                </p>
              </div>
              <button className="text-blue-500 hover:text-blue-600 text-sm">
                변경
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">계정 삭제</h3>
                <p className="text-sm text-gray-500">
                  계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <button className="text-red-500 hover:text-red-600 text-sm">
                삭제
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
