import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLoginButton } from "./GoogleLoginButton";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  onForgotPassword?: () => void;
  isLoading: boolean;
}

export const LoginForm = ({
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  isLoading,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="space-y-6">
      {/* Google Login Button */}
      {onGoogleLogin && (
        <>
          <GoogleLoginButton onLogin={onGoogleLogin} isLoading={isLoading} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                or continue with email
              </span>
            </div>
          </div>
        </>
      )}

      {/* Email/Password Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-neutral-700 mb-3"
          >
            Email Address
          </label>
          <input
            {...form.register("email")}
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
          />
          {form.formState.errors.email && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-700"
            >
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-orange-500 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
        <p className="text-center text-sm font-semibold text-neutral-600 mb-2">
          Demo Credentials:
        </p>
        <div className="space-y-1 text-xs text-neutral-500 text-center">
          <p>
            <span className="font-medium">User:</span> user@example.com /
            password
          </p>
          <p>
            <span className="font-medium">Artist:</span> artist@example.com /
            password
          </p>
          <p>
            <span className="font-medium">Admin:</span> admin@example.com /
            password
          </p>
        </div>
      </div>
    </div>
  );
};
