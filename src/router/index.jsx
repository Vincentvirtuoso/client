import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import NotFound from "../pages/NotFound";
import LoginSignup from "../pages/auth/LoginSignup";
import Orders from "../pages/Orders";
import SavedProducts from "../pages/SavedProducts";
import OrderDetail from "../pages/OrderDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      {
        path: "checkout",
        element: (
          // <ProtectedRoute>
          <Checkout />
          // </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          // <ProtectedRoute>
          <Orders />
          // </ProtectedRoute>
        ),
      },
      {
        path: "order/:orderId",
        element: (
          // <ProtectedRoute>
          <OrderDetail />
          // </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          // <ProtectedRoute>
          <SavedProducts />
          // </ProtectedRoute>
        ),
      },
      { path: "order-success", element: <OrderSuccess /> },
    ],
  },
  {
    path: "/auth",
    children: [
      { index: true, element: <LoginSignup authState="login" /> },
      { path: "login", element: <LoginSignup authState="login" /> },
      { path: "register", element: <LoginSignup authState="register" /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
