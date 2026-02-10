import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
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
