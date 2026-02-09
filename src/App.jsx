import { Outlet } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";
import Sidebar from "./components/layouts/Sidebar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const [promoBannerVisible, setPromoBannerVisible] = useState(false);
  const onSignIn = () => {
    window.location.href = "/auth";
  };

  return (
    <AuthProvider>
      <AnimatePresence>
        {promoBannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-linear-to-r from-red-600 via-pink-600 to-red-600 text-white fixed top-0 left-0 right-0 z-99"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm h-14 lg:h-auto">
              <div className="flex-1 text-center">
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-semibold sm:text-sm text-xs"
                >
                  🎉 FLASH SALE: Up to 50% OFF on Electronics | Free Shipping on
                  Orders ₦50k+ | Ends in 2:45:30
                </motion.span>
              </div>
              <button
                onClick={() => setPromoBannerVisible(false)}
                className="ml-4 hover:bg-white/20 rounded p-1"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={`flex min-h-screen bg-gray-50 ${
          promoBannerVisible ? "mt-14 lg:mt-9" : "top-0"
        }`}
      >
        {/* Persistent sidebar on large screens */}
        <div className="hidden lg:block">
          <Sidebar
            promoBannerVisible={promoBannerVisible}
            onSignIn={onSignIn}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-72">
          <Navbar promoBannerVisible={promoBannerVisible} onSignIn={onSignIn} />
          <main
            className={`flex-1  transition-all ${
              promoBannerVisible ? "pt-20" : "pt-19"
            }`}
          >
            <Outlet />
          </main>
          <Footer />
        </div>

        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              border: "#bbb",
              zIndex: 9999,
            },
            success: { iconTheme: { primary: "#fb2c36", secondary: "#fff" } },
            duration: 2000,
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default App;
