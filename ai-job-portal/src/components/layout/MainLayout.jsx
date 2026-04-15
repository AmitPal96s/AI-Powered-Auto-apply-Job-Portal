import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import AIChatWidget from "../ui/ai/AIChatWidget";

void motion;

function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <main className="mx-auto w-full max-w-7xl pb-24 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
      <AIChatWidget />
    </div>
  );
}

export default MainLayout;
