// src/layout/MainLayout.tsx

/**
 * 공통 레이아웃 컴포넌트
 *
 * props 대신 Zustand 스토어에서 직접 user 정보를 가져옵니다.
 */

import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container-main py-8">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="container-main py-4 text-center text-sm">
          © 2025 My Dev Blog. Built with React + Firebase
        </div>
      </footer>
    </div>
  );
}

export default Layout;
