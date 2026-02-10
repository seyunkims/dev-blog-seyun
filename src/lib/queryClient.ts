import { QueryClient } from "@tanstack/react-query";
import { STALE_TIME, GC_TIME } from "@/constants";

/**
 * Query Client 인스턴스
 *
 * 전역 설정을 적용합니다.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            gcTime: GC_TIME,

            // 실패 시 재시도 횟수
            retry: 1,

            // 윈도우 포커스 시 자동 리페칭
            refetchOnWindowFocus: false,
        },
        mutations: {
            // 뮤테이션 실패 시 재시도 안 함
            retry: 0,
        },
    },
});
