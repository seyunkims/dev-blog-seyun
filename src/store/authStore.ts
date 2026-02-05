// src/store/authStore.ts

/**
 * 인증 상태 전역 스토어
 *
 * Zustand를 사용하여 인증 상태를 전역으로 관리합니다.
 * 어떤 컴포넌트에서든 useAuthStore()로 접근할 수 있습니다.
 *
 * 📚 Zustand 문서: https://zustand-demo.pmnd.rs/
 */

import { create } from "zustand";
import type { User } from "@/types";

/**
 * Auth Store 상태 타입
 */
interface AuthState {
    /** 현재 로그인한 사용자 (없으면 null) */
    user: User | null;

    /** 인증 상태 로딩 중 여부 */
    isLoading: boolean;

    /** 사용자 정보 설정 */
    setUser: (user: User | null) => void;

    /** 로딩 상태 설정 */
    setIsLoading: (isLoading: boolean) => void;
}

/**
 * Auth Store 생성
 *
 * create() 함수로 스토어를 생성합니다.
 * 반환된 useAuthStore 훅을 컴포넌트에서 사용합니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
    // 초기 상태
    user: null,
    isLoading: true,

    // 액션 (상태 변경 함수)
    setUser: (user) => set({ user }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
