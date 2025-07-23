import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ExtendedUser extends User {
  profile?: UserProfile;
}

interface UserState {
  user: ExtendedUser | null;
  isLoading: boolean;
  setUser: (user: ExtendedUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true, // 초기에는 로딩 상태로 시작
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => set({ user: null, isLoading: false }), // 로딩도 false로 설정
    }),
    {
      name: "user-storage", // localStorage 키 이름
      partialize: (state) => ({ user: state.user }), // user만 저장 (isLoading은 저장하지 않음)
      onRehydrateStorage: () => (state) => {
        // 스토리지에서 상태를 복원한 후 로딩을 true로 설정
        if (state) {
          state.setLoading(true);
        }
      },
    }
  )
);
