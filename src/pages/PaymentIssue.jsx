import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTriangleAlert, LuRefreshCw } from "react-icons/lu";

const PaymentIssue = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from navigation
  const { reference, amount, email } = location.state || {};

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  // Check if data is available
  useEffect(() => {
    if (!reference || !amount) {
      // If no data, redirect to home or payments page
      navigate("/payments");
    }
  }, [reference, amount, navigate]);

  const handleRetryPayment = async () => {
    if (retryCount >= 2) {
      alert("Maximum retry attempts reached. Please contact support.");
      return;
    }

    setIsRetrying(true);

    try {
      // Simulate retry payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically:
      // 1. Call your backend to verify payment status
      // 2. Or initiate a new payment

      // For demo, we'll show success after 2 seconds
      setIsRetrying(false);
      setRetryCount((prev) => prev + 1);

      alert(
        "Payment retry initiated. Please check your email for confirmation."
      );
    } catch (error) {
      setIsRetrying(false);
      alert("Retry failed. Please try again or contact support.");
    }
  };

  const handleContactSupport = () => {
    const subject = `Payment Issue - Reference: ${reference}`;
    const body = `I'm having issues with payment:\n\nReference: ${reference}\nAmount: ${amount}\nEmail: ${email}\n\nIssue: ${
      selectedOption || "Not specified"
    }`;

    // Open email client
    window.location.href = `mailto:support@yourcompany.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const commonIssues = [
    { id: "insufficient", label: "Insufficient funds" },
    { id: "declined", label: "Card declined by bank" },
    { id: "timeout", label: "Payment timeout" },
    { id: "technical", label: "Technical error" },
    { id: "other", label: "Other issue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <LuTriangleAlert className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Encountered an Issue
          </h1>
          <p className="text-gray-600">
            We encountered an issue processing your payment
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono text-sm font-semibold">
                {reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(amount / 100)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold">{email}</span>
            </div>
          </div>
        </div>

        {/* Issue Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What was the issue? (Optional)
          </label>
          <div className="space-y-2">
            {commonIssues.map((issue) => (
              <label
                key={issue.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="issue"
                  value={issue.id}
                  checked={selectedOption === issue.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {issue.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            disabled={isRetrying || retryCount >= 2}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRetrying ? (
              <>
                <LuRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : retryCount >= 2 ? (
              "Maximum Retries Reached"
            ) : (
              "Try Payment Again"
            )}
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Contact Support
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            If you've been charged but didn't receive confirmation, please
            contact support with your reference number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentIssue;
