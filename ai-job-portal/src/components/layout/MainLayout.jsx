import { Outlet } from "react-router-dom";
import AIChatWidget from "../ui/ai/AIChatWidget";

function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:bg-gray-950">
      <main className="mx-auto w-full max-w-7xl pb-24 sm:pb-28">
        <Outlet />
      </main>
      <AIChatWidget />
    </div>
  );
}

export default MainLayout;
