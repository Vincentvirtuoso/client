import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const VerifyEmailNotice = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail, user } = useAuth();

  const userEmail = state?.email || user?.email || "user@example.com";

  // Auto-redirect if user is already verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !userEmail) return;

    setIsResending(true);
    setResendError(null);

    try {
      const data = await resendVerificationEmail(userEmail);

      if (data?.success) {
        setResendSuccess(true);
        setResendCooldown(30); // 30 seconds cooldown
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setResendError(data?.message || "Failed to resend verification email");
      }
    } catch (err) {
      setResendError(err.message || "An error occurred");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
            >
              <FiMail className="w-10 h-10 text-red-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Verify Your Email
            </h1>

            {state?.autoSentEmail ? (
              <>
                <p className="text-gray-600">
                  We've sent a verification link to
                </p>
                <p className="text-gray-800 font-medium bg-gray-50 rounded-lg py-2 px-4 inline-block">
                  {userEmail}
                </p>{" "}
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="mt-2 text-sm text-red-700">
                    <p className="mb-2">
                      To complete your account setup, you'll need to verify your
                      email address.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    Ready to verify? Click the button to send a verification
                    link to:
                  </p>
                  <p className="text-gray-800 font-medium bg-gray-50 rounded-lg py-2 px-4 inline-block">
                    {userEmail}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-semibold">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xl md:text-2xl">
                  Check your inbox
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Look for an email from us with the subject "Verify your email
                  address"
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-semibold">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xl md:text-2xl">
                  Click the verification link
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  The link will automatically verify your email address
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-semibold">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xl md:text-2xl">
                  Get started
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Once verified, you'll have full access to your account
                </p>
              </div>
            </div>
          </div>

          {/* Resend Email Section */}
          <div className="border-t border-gray-500/30 pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Didn't receive the email?</p>

              <AnimatePresence mode="wait">
                {resendSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-4"
                  >
                    <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                      <FiCheckCircle />
                      <span className="font-medium">
                        Email sent successfully!
                      </span>
                    </div>
                  </motion.div>
                ) : resendError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-4"
                  >
                    <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                      <span className="font-medium">{resendError}</span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: resendCooldown > 0 ? 1 : 1.02 }}
                whileTap={{ scale: resendCooldown > 0 ? 1 : 0.98 }}
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0 || !userEmail}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-all
                  ${
                    resendCooldown > 0 || isResending || !userEmail
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow"
                  }
                `}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <FiRefreshCw className="animate-spin mr-2" />
                    Sending...
                  </span>
                ) : resendCooldown > 0 ? (
                  <span className="flex items-center justify-center">
                    <FiClock className="mr-2" />
                    Resend available in {resendCooldown}s
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FiRefreshCw className="mr-2" />
                    Resend Verification Email
                  </span>
                )}
              </motion.button>

              <p className="text-sm text-gray-500 mt-4">
                Make sure to check your spam folder if you don't see the email.
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-500/30 text-center">
            <p className="text-gray-600 text-sm">
              Need help?{" "}
              <a
                href="mailto:support@example.com"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailNotice;
