"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserData } from "@/app/lib/useUserData";
import { supabase } from "@/lib/supabaseClient";
import PrivateRoute from "@/components/PrivateRoute";

export default function CreatePostPage() {
  const [title, setTitle] = useState(""); // title 필드 다시 추가 ////
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUserData();
  const router = useRouter();

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      // title도 체크 ////
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Creating post with data:", {
        title: title.trim(), // title 추가 ////
        content: content.trim(),
        author_id: user.id,
      });

      // 먼저 users 테이블에 사용자가 있는지 확인
      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userCheckError) {
        console.log("User check error:", userCheckError);

        // 사용자가 없다면 생성 시도
        if (userCheckError.code === "PGRST116") {
          console.log("User not found, creating new user...");

          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email || "",
            name:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Anonymous",
            nickname:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Anonymous",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error("User insert error:", insertError);
            setError(`사용자 생성 실패: ${insertError.message}`);
            return;
          }
        } else {
          setError(`사용자 확인 실패: ${userCheckError.message}`);
          return;
        }
      }

      // 게시글 생성 (title 포함) ////
      const { data, error: postError } = await supabase
        .from("posts")
        .insert({
          title: title.trim(), // title 추가 ////
          content: content.trim(),
          author_id: user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (postError) {
        console.error("Post creation error:", postError);
        setError(`게시글 작성 실패: ${postError.message}`);
        return;
      }

      console.log("Post created successfully:", data);
      alert("게시글이 성공적으로 작성되었습니다!");
      router.push("/posts");
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setError(error.message || "예상치 못한 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            새 게시글 작성
          </h1>
          <p className="text-gray-600">
            자유롭게 생각을 나누고 이야기해보세요.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={createPost} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="게시글 제목을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                내용 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="게시글 내용을 입력하세요"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "작성 중..." : "게시글 작성"}
              </button>
              <Link
                href="/posts"
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-400 transition-colors inline-block text-center"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
}
