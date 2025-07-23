"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/app/lib/userStore";

// public.users 테이블의 사용자 프로필 타입
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserData() {
  const { user, isLoading, setUser, setLoading, clearUser } = useUserStore();

  const getUserData = async () => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        // 사용자가 없을 때
        if (isLoading) {
          setUser(null);
          setLoading(false);
        }
        return { success: false, error: "사용자 인증 정보가 없습니다." };
      }

      // public.users 테이블에서 사용자 프로필 정보 가져오기
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        // 프로필이 없으면 생성하려고 시도 (트리거가 실패했을 경우를 대비)
        const { error: insertError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.full_name || authData.user.email,
          nickname:
            authData.user.user_metadata?.full_name ||
            authData.user.email?.split("@")[0],
        });

        if (!insertError) {
          // 다시 프로필 가져오기
          const { data: newProfileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (newProfileData) {
            // 사용자 객체에 프로필 정보 추가
            const userWithProfile = {
              ...authData.user,
              profile: newProfileData,
            };
            setUser(userWithProfile);
          } else {
            setUser(authData.user);
          }
        } else {
          setUser(authData.user);
        }
      } else {
        // 사용자 객체에 프로필 정보 추가
        const userWithProfile = {
          ...authData.user,
          profile: profileData,
        };
        setUser(userWithProfile);
      }

      setLoading(false);
      return { success: true, user: authData.user, profile: profileData };
    } catch (error) {
      console.error("사용자 데이터 가져오기 오류:", error);
      clearUser();
      return {
        success: false,
        error: "사용자 데이터를 가져오는 중 오류가 발생했습니다.",
      };
    }
  };

  // 컴포넌트 마운트 시 사용자 데이터 가져오기
  useEffect(() => {
    // 이미 로딩이 완료되었고 사용자 정보가 있다면 다시 확인하지 않음
    if (!isLoading && user) {
      return;
    }

    // 초기 로드 시 사용자 데이터 확인
    getUserData();

    // auth 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        getUserData();
      } else if (event === "SIGNED_OUT") {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // 빈 dependency array

  return {
    user,
    isLoading,
    getUserData,
    clearUser,
  };
}
