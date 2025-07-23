"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // 게시글 작성 버튼용 ////
import { useUserData } from "@/lib/useUserData";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string; // uuid 타입 유지 ////
  title: string; // title 필드 다시 추가 ////
  content: string;
  author_id: string;
  created_at: string;
  users: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    avatar_url: string;
  } | null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserData();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      // users 테이블과 join해서 작성자 정보 가져오기 ////
      const { data, error: supabaseError } = await supabase
        .from("posts")
        .select(
          `
          *,
          users:author_id (
            id,
            email,
            name,
            nickname,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw supabaseError;
      }

      console.log("Posts fetched:", data);
      setPosts(data || []);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message || "게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 작성자 이름을 표시하는 함수 ////
  const getAuthorName = (post: Post) => {
    if (!post.users) {
      return `사용자 ${post.author_id.substring(0, 8)}...`;
    }

    return (
      post.users.nickname || post.users.name || post.users.email.split("@")[0]
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-700">오류: {error}</p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchPosts();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">게시판</h1>
          <p className="text-gray-600">
            자유롭게 생각을 나누고 이야기해보세요.
          </p>
        </div>
        {user && (
          <Link
            href="/posts/create"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            새 글 작성
          </Link>
        )}
      </div>

      {!user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <p className="text-gray-600 mb-4">
            게시글을 작성하려면 로그인이 필요합니다.
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

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {post.title} {/* 링크 제거, 일반 텍스트로 표시 */} ////
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {/* 아바타 이미지 표시 (있는 경우) */} ////
                  {post.users?.avatar_url && (
                    <img
                      src={post.users.avatar_url}
                      alt={`${getAuthorName(post)}의 아바타`}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-500">
                    작성자: {getAuthorName(post)}{" "}
                    {/* join된 작성자 정보 표시 */} ////
                  </span>
                </div>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  자세히 보기 →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
