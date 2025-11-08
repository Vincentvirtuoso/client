import { Outlet } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#333", color: "#fff" },
          success: { iconTheme: { primary: "#fb2c36", secondary: "#fff" } },
          duration: 2000,
        }}
      />
    </div>
  );
}

export default App;
