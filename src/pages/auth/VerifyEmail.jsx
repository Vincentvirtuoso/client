import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(5);
  const { verifyEmail, user, setUser } = useAuth();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyEmailToken = async () => {
    try {
      const data = await verifyEmail(token, email);

      if (data?.success) {
        setVerificationStatus("success");

        if (data?.user) {
          setUser(data.user);
        }
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      setVerificationStatus("error");
    }
  };
  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      return;
    }
    if (verificationStatus === "success") return;

    verifyEmailToken();
  }, []);

  useEffect(() => {
    if (verificationStatus === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);

            // Redirect based on user role or default dashboard
            if (user?.role) {
              navigate(`/${user.role}/dashboard`);
            } else {
              navigate("/dashboard");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [verificationStatus, navigate, user]);

  const handleManualRedirect = () => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/dashboard");
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-8"
            >
              <FiLoader className="w-12 h-12 text-red-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 mb-8">
              Please wait while we verify your email address...
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blredue-600 rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
              <MdOutlineMarkEmailRead className="w-14 h-14 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Email Verified!
            </h1>

            <p className="text-gray-600 mb-6">
              Your email{" "}
              <span className="font-semibold text-red-600">
                {email || user?.email || "your email"}
              </span>{" "}
              has been successfully verified.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 text-green-700 mb-4">
                <FiCheckCircle className="w-6 h-6" />
                <span className="font-semibold">Verification Complete</span>
              </div>
              <p className="text-green-600 text-sm">
                You now have full access to all features of your account.
                {user?.role && ` Welcome, ${user.role}!`}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Redirecting to dashboard in {countdown} seconds...
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleManualRedirect}
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm hover:shadow transition-all"
              >
                <span className="flex items-center justify-center">
                  Go to Dashboard
                  <FiArrowRight className="ml-2" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
              <FiAlertCircle className="w-14 h-14 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>

            <p className="text-gray-600 mb-6">
              {token
                ? "The verification link is invalid or has expired."
                : "No verification token provided."}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 text-red-700 mb-4">
                <FiAlertCircle className="w-6 h-6" />
                <span className="font-semibold">
                  {token ? "Link Expired or Invalid" : "Missing Token"}
                </span>
              </div>
              <p className="text-red-600 text-sm">
                Please request a new verification email from your account
                settings.
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate("/auth/verify-email-notice", { state: { email } })
                }
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm hover:shadow transition-all"
              >
                Request New Verification Email
              </motion.button>

              <button
                onClick={() => navigate("/auth/login")}
                className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-400/50">
            <p className="text-center text-gray-500 text-sm">
              Need help?{" "}
              <a
                href="mailto:support@example.com"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
