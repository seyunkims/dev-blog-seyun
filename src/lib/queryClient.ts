/**
 * TanStack Query Client 설정
 *
 * 📚 공식 문서: https://tanstack.com/query/latest/docs/react/overview
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Query Client 인스턴스
 *
 * 전역 설정을 적용합니다.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 데이터가 "신선"하다고 간주되는 시간 (5분)
            // 이 시간 동안은 캐시된 데이터 사용
            staleTime: 1000 * 60 * 5,

            // 캐시 유지 시간 (10분)
            // 컴포넌트가 언마운트되어도 이 시간 동안 캐시 유지
            gcTime: 1000 * 60 * 10,

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
