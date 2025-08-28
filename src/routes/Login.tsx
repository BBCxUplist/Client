import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isArtist, setIsArtist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login, register, resetPassword, loginWithGoogle } = useAuth();
  const { registerUser, registerArtist } = useAppStore();
  const navigate = useNavigate();

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setError("");
    setSuccessMessage("");

    try {
      await loginWithGoogle();
      // Note: Google OAuth will redirect to the dashboard automatically
      // The AuthProvider will handle the session update
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "An error occurred during Google login");
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const role = isArtist ? "artist" : "user";
      const result = await register(data.email, data.password, {
        name: data.name,
        role,
      });

      if (result && 'needsConfirmation' in result) {
        setSuccessMessage("Please check your email to confirm your account before signing in.");
        setActiveTab("login");
      } else {
        // User was automatically logged in
        if (isArtist) {
          registerArtist({
            name: data.name,
            slug: data.name.toLowerCase().replace(/\s+/g, "-"),
          });
        } else {
          registerUser({
            name: data.name,
          });
        }
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async () => {
    const email = prompt("Enter your email address to reset your password:");
    if (!email) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await resetPassword(email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "An error occurred while sending the reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 overflow-y-auto">
        <div className="min-h-screen flex flex-col p-6 lg:p-12">
          {/* Back Button - Top Left */}
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-orange-500 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>

          {/* Centered Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-black p-2 rounded-2xl">
                    <img src="/logo/logo.png" alt="uplist" className="w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-bold font-dm-sans text-neutral-800">
                    Welcome to Uplist
                  </h1>
                </div>
                <p className="text-neutral-600">
                  Connect with amazing artists and book your next event
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-neutral-100 rounded-3xl p-1.5 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-white text-neutral-800 shadow-lg"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-6 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-white text-neutral-800 shadow-lg"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Register
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-red-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="flex items-center space-x-3 p-4 mb-6 bg-green-50 border border-green-200 rounded-2xl text-green-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{successMessage}</span>
                </div>
              )}

              {/* Forms */}
              <div>
                {activeTab === "login" ? (
                  <LoginForm 
                    onSubmit={onLoginSubmit} 
                    onGoogleLogin={onGoogleLogin}
                    onForgotPassword={onForgotPassword}
                    isLoading={isLoading} 
                  />
                ) : (
                  <RegisterForm
                    onSubmit={onRegisterSubmit}
                    isLoading={isLoading}
                    isArtist={isArtist}
                    onToggleRole={() => setIsArtist(!isArtist)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image with Overlay (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 h-screen sticky top-0">
        <img
          src="/images/artistOnStage.jpeg"
          alt="Artist performing"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Dynamic Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-lg">
            {(activeTab === "register" && isArtist) ? (
              /* Artist Content */
              <>
                <h2 className="text-4xl font-bold font-dm-sans mb-6">
                  Share Your Talent
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Join thousands of artists earning from their passion. Get booked for events, build your fanbase, and turn your music into a sustainable career.
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Get discovered by event organizers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Secure payments & verified bookings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Build your professional profile</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Connect directly with clients</span>
                  </div>
                </div>
              </>
            ) : (
              /* User/Client Content */
              <>
                <h2 className="text-4xl font-bold font-dm-sans mb-6">
                  Book Amazing Live Music
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Discover talented musicians, book secure performances, and create unforgettable experiences for your events.
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Browse verified artists with reviews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Secure escrow payments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Direct messaging and coordination</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Easy booking management</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
