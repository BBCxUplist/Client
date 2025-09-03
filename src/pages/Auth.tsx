// pages/Auth.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
}

const Auth = () => {
  const [activeMode, setActiveMode] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isArtist: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (activeMode === "register" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (activeMode === "register") {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", {
        mode: activeMode,
        data: formData,
      });

      // Handle successful authentication here
      // e.g., redirect to dashboard or home page
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode: "signin" | "register") => {
    setActiveMode(mode);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isArtist: false,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-mondwest text-4xl md:text-6xl font-bold text-white mb-4">
              {activeMode === "signin" ? "SIGN IN" : "JOIN UPLIST"}
            </h1>
            <p className="text-white/70 text-lg">
              {activeMode === "signin"
                ? "Welcome back to the platform"
                : "Create your account and start your journey"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="bg-white/5 p-1 mb-8 border border-white/10">
            <div className="grid grid-cols-2 gap-0">
              <button
                onClick={() => switchMode("signin")}
                className={`py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeMode === "signin"
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/10"
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeMode === "register"
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/10"
                }`}
              >
                REGISTER
              </button>
            </div>
          </div>

          {/* Form */}
          <motion.form
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name Field (Register Only) */}
            {activeMode === "register" && (
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full bg-white/5 border ${
                    errors.name ? "border-red-500" : "border-white/20"
                  } text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full bg-white/5 border ${
                  errors.email ? "border-red-500" : "border-white/20"
                } text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full bg-white/5 border ${
                    errors.password ? "border-red-500" : "border-white/20"
                  } text-white placeholder:text-white/50 p-3 pr-12 focus:border-orange-500 focus:outline-none transition-colors`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register Only) */}
            {activeMode === "register" && (
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full bg-white/5 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-white/20"
                    } text-white placeholder:text-white/50 p-3 pr-12 focus:border-orange-500 focus:outline-none transition-colors`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Artist Toggle (Register Only) */}
            {activeMode === "register" && (
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">
                      Join as an Artist
                    </p>
                    <p className="text-white/60 text-xs">
                      Get verified and receive booking opportunities
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("isArtist", !formData.isArtist)
                    }
                    className={`relative w-12 h-6 border transition-all duration-300 ${
                      formData.isArtist
                        ? "bg-orange-500 border-orange-500"
                        : "bg-white/10 border-white/30"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-300 ${
                        formData.isArtist ? "left-6" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {formData.isArtist && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20"
                  >
                    <p className="text-orange-400 text-xs">
                      🎵 You'll be able to create your artist profile, upload
                      music, and receive booking requests after registration.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-semibold transition-all duration-300 ${
                isLoading
                  ? "bg-white/10 text-white/50 cursor-not-allowed"
                  : "bg-orange-500 text-black hover:bg-orange-600"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin" />
                  {activeMode === "signin"
                    ? "SIGNING IN..."
                    : "CREATING ACCOUNT..."}
                </div>
              ) : activeMode === "signin" ? (
                "SIGN IN"
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </motion.form>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-4">
            {activeMode === "signin" && (
              <Link
                to="/forgot-password"
                className="block text-white/60 hover:text-orange-500 transition-colors text-sm"
              >
                Forgot your password?
              </Link>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/50 text-xs">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              to="/"
              className="block text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-dashed border-white/20 text-center">
            <p className="text-white/40 text-xs">
              By{" "}
              {activeMode === "signin" ? "signing in" : "creating an account"},
              you agree to our{" "}
              <Link to="/terms" className="text-orange-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
