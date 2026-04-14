import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AIChatWidget from "../ui/ai/AIChatWidget";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <AIChatWidget />
    </div>
  );
}

export default MainLayout;