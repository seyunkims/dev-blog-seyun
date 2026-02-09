import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";
import { useAuthStore } from "@/store/authStore";
import MainLayout from "@/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";

// 다크모드 적용
import { useTheme } from "@/hooks/useTheme";
// 토스트 알림 컨포넌트
import { Toaster } from "@/components/ui/sonner";
// 페이지 로딩
import PageLoading from "@/components/PageLoading";
// 404 페이지
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  const { isLoading, setUser, setIsLoading } = useAuthStore();
  // 다크모드 훅 호출
  useTheme();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  // 인증 상태 로딩 중
  if (isLoading) {
    return <PageLoading message="사용자 정보를 불러오는 중입니다..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 레이아웃이 적용되는 라우트 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

            {/* 보호된 라우트 - 로그인 필요 */}
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <PostWritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEditPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 인증 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {/* Toast 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
