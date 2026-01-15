import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import {
  LuEye,
  LuEyeOff,
  LuShoppingBag,
  LuShield,
  LuTruck,
  LuCreditCard,
} from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useForm } from "../../hooks/useForm";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../../hooks/useAuth";

const SocialButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    type="button"
    className={`flex items-center gap-3 border border-gray-300 w-full justify-center py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
  >
    {children}
  </button>
);

const slides = [
  {
    icon: LuShoppingBag,
    title: "Shop With Confidence",
    description: "Browse thousands of products from trusted sellers worldwide",
    gradient: "from-orange-600 to-red-600",
  },
  {
    icon: LuShield,
    title: "Secure & Protected",
    description: "Bank-level encryption keeps your data safe and private",
    gradient: "from-pink-600 to-red-600",
  },
  {
    icon: LuTruck,
    title: "Fast Delivery",
    description: "Track your orders in real-time with express shipping options",
    gradient: "from-orange-600 to-yellow-600",
  },
  {
    icon: LuCreditCard,
    title: "Easy Payments",
    description: "Multiple payment options with secure checkout process",
    gradient: "from-green-600 to-teal-600",
  },
];

const initialValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const validate = (form, isLogin = true) => {
  if (!form.email || !form.password) return "Email and password are required.";
  if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(form.email))
    return "Please enter a valid email address.";
  if (form.password.length < 6)
    return "Password must be at least 6 characters.";
  if (!isLogin && (!form.firstName || !form.lastName || !form.phoneNumber))
    return "Please provide your full name and phone number.";
  return "";
};

const LoginSignup = ({ authState }) => {
  const mode =
    typeof authState === "string"
      ? authState
      : authState?.authState || authState?.from || "login";
  const isLogin = ["login", "sign-in", "signin"].includes(mode);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, loading, register } = useAuth();

  const onSubmit = async (form) => {
    try {
      let result;
      if (isLogin) {
        delete form.firstName;
        delete form.lastName;
        delete form.phoneNumber;
        result = await login(form);
      } else {
        result = await register(form);
      }

      if (!result) {
        toast.error(error?.message || "An error occurred");
        return;
      }

      if (!result.success) {
        toast.error(result.message || "Operation failed");
        return;
      }

      toast.success(
        isLogin ? "Welcome back 👋" : "Account created successfully!"
      );

      if (isLogin) {
        navigate("/");
      } else {
        navigate("/auth/verify-email-notice", {
          state: {
            autoSentEmail: true,
            email: form.email,
            expiresIn: result.expiresIn,
          },
        });
      }
    } catch (error) {
      toast.error(error?.message);
      if (isLogin && error?.code === "EMAIL_NOT_VERIFIED") {
        navigate("/auth/verify-email-notice", { state: { email: form.email } });
      }
    }
  };

  const { form, error, handleChange, handleSubmit } = useForm(
    initialValues,
    (f) => validate(f, isLogin),
    onSubmit
  );

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 py-12 px-1">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-screen overflow-hidden">
        {/* Left Side - Swiper Slideshow */}
        <div className="hidden lg:block h-screen">
          <div className="h-full bg-white shadow-2xl overflow-hidden">
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              loop={true}
              className="h-full"
            >
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                return (
                  <SwiperSlide key={index}>
                    <div
                      className={`h-full bg-linear-to-br ${slide.gradient} flex flex-col items-center justify-center text-white p-12 relative`}
                    >
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10 text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                          <Icon className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-bold">{slide.title}</h2>
                        <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex h-screen overflow-y-auto w-full py-4">
          <div className="w-full max-w-xl mx-auto">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-600 to-red-600 rounded-2xl mb-4">
                <LuShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to continue your shopping journey"
                  : "Create an account to unlock exclusive deals"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Social login */}
              <div className="space-y-3">
                <SocialButton onClick={() => toast("Social login coming soon")}>
                  <FcGoogle className="text-xl" />
                  <span className="text-sm font-medium">
                    Continue with Google
                  </span>
                </SocialButton>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                      />
                    </div>
                    <NigerianPhoneInput
                      form={form}
                      handleChange={handleChange}
                    />
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <LuEyeOff className="w-5 h-5" />
                      ) : (
                        <LuEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Remember me</span>
                  </label>
                  {isLogin && (
                    <Link
                      to="/auth/forgot"
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {isLogin ? (
                  <button
                    type="submit"
                    className={`w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform active:scale-[0.98] ${
                      loading.login
                        ? "bg-red-600/40 hover:bg-red-700/40 cursor-wait"
                        : ""
                    } flex gap-4 justify-center items-center`}
                    disabled={loading.login}
                  >
                    {loading.login ? "Signing in…" : "Sign In"}
                    {loading.login && <Spinner />}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform active:scale-[0.98] ${
                      loading.register
                        ? "bg-red-600/40 hover:bg-red-700/40 cursor-wait"
                        : ""
                    } flex gap-4 justify-center items-center`}
                    disabled={loading.register}
                  >
                    {loading.register ? "Creating account…" : "Create Account"}

                    {loading.register && <Spinner />}
                  </button>
                )}
              </form>

              <p className="text-center text-sm text-gray-600">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <Link
                      to="/auth/register"
                      className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-6 px-4">
              By continuing, you agree to our{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Privacy Policy
              </a>
            </p>
            {/* Trust indicators */}
            <div className="pt-6 z-20">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-gray-900 text-xl">500K+</div>
                    <div className="text-xs text-gray-600">Active Users</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">4.8★</div>
                    <div className="text-xs text-gray-600">Customer Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default LoginSignup;

const NigerianPhoneInput = ({ form, handleChange }) => {
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    // Convert +234 to 0
    if (value.startsWith("234")) {
      value = "0" + value.slice(3);
    }

    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Format with spaces
    let formattedValue = value;
    if (value.length >= 4) {
      formattedValue = value.slice(0, 4) + " " + value.slice(4);
    }
    if (value.length >= 8) {
      formattedValue =
        value.slice(0, 4) + " " + value.slice(4, 7) + " " + value.slice(7);
    }

    // Update form
    const event = {
      target: {
        name: "phoneNumber",
        value: formattedValue,
      },
    };
    handleChange(event);

    // Basic validation
    if (
      value.length === 11 &&
      ["070", "080", "081", "090", "091"].some((prefix) =>
        value.startsWith(prefix)
      )
    ) {
      setError("");
    } else if (value.length > 0) {
      setError("Enter a valid 11-digit Nigerian number");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500">+234</span>
        </div>
        <input
          className={`w-full border ${
            error ? "border-red-300" : "border-gray-300"
          } rounded-lg px-4 py-3 pl-14 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none`}
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="0803 123 4567"
          maxLength="14"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
