import { useState } from "react";
import {
  LuShield,
  LuMail,
  LuHeart,
  LuChevronRight,
  LuCheck,
  LuLoader,
  LuSend,
  LuLock,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const EnvelopeAnimation = ({ isSubmitting, isSubmitted }) => {
  return (
    <div className="relative h-24 mb-6 flex justify-center items-center">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: isSubmitting ? [0, -20, -100] : 0,
              rotate: isSubmitting ? [0, -10, 20] : 0,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <LuMail className="w-10 h-10 text-white" />
            </div>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
              >
                <LuSend className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40"
          >
            <LuCheck className="w-10 h-10 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative p-1 overflow-hidden shadow-2xl mb-8"
    >
      <div className="relative bg-red-800 backdrop-blur-3xl p-8 md:p-16 border border-white/10 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <EnvelopeAnimation
            isSubmitting={isLoading}
            isSubmitted={isSubmitted}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Elevate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
                Lifestyle
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-200 max-w-xl mx-auto leading-relaxed">
              Join 100,000+ fashion insiders and get the industry's most curated
              style updates weekly.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  You're on the list!
                </h3>
                <p className="text-slate-200">
                  Welcome to the inner circle. Check your inbox.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="relative z-10 max-w-md mx-auto space-y-4"
              >
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />
                  <div className="relative flex items-center">
                    <LuMail className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="flex-[2] relative overflow-hidden bg-white text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <LuLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Subscribe <LuChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-slate-200 text-sm">
              <LuLock className="w-4 h-4 text-indigo-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200 text-sm">
              <LuHeart className="w-4 h-4 text-rose-400" />
              <span>No Spam, Ever</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsletterSection;
