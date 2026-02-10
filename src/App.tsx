import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { subscribeToAuthState } from "./lib/auth";
import { queryClient } from "./lib/queryClient";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import PageLoading from "./components/PageLoading";
import { useTheme } from "@/hooks/useTheme";
import MainLayout from "@/layout/MainLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const PostWritePage = lazy(() => import("./pages/PostWritePage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const PostEditPage = lazy(() => import("./pages/PostEditPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
    const { isLoading, setUser, setIsLoading } = useAuthStore();
    useTheme();

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setIsLoading]);

    if (isLoading) {
        return <PageLoading message="사용자 정보를 불러오는 중입니다..." />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path={ROUTES.HOME} element={<HomePage />} />
                            <Route
                                path={ROUTES.POST_DETAIL}
                                element={<PostDetailPage />}
                            />
                            <Route
                                path={ROUTES.WRITE}
                                element={
                                    <ProtectedRoute>
                                        <PostWritePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path={ROUTES.POST_EDIT}
                                element={
                                    <ProtectedRoute>
                                        <PostEditPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path={ROUTES.PROFILE}
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>

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
