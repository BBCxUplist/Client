import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, User, Mic } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  isArtist: boolean;
  onToggleRole: () => void;
}

export const RegisterForm = ({
  onSubmit,
  isLoading,
  isArtist,
  onToggleRole,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Selection */}
      <div className="flex bg-neutral-100 rounded-2xl p-1 mb-6">
        <button
          type="button"
          onClick={() => isArtist && onToggleRole()}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            !isArtist
              ? "bg-white text-neutral-800 shadow-md"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <User className="h-4 w-4" />
          User
        </button>
        <button
          type="button"
          onClick={() => !isArtist && onToggleRole()}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isArtist
              ? "bg-white text-neutral-800 shadow-md"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <Mic className="h-4 w-4" />
          Artist
        </button>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-neutral-700 mb-3"
        >
          Full Name
        </label>
        <input
          {...form.register("name")}
          type="text"
          id="name"
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
        />
        {form.formState.errors.name && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="reg-email"
          className="block text-sm font-semibold text-neutral-700 mb-3"
        >
          Email Address
        </label>
        <input
          {...form.register("email")}
          type="email"
          id="reg-email"
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
        <label
          htmlFor="reg-password"
          className="block text-sm font-semibold text-neutral-700 mb-3"
        >
          Password
        </label>
        <div className="relative">
          <input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            id="reg-password"
            placeholder="Create a password"
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

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-semibold text-neutral-700 mb-3"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            {...form.register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            placeholder="Confirm your password"
            className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-orange-500 transition-colors duration-200"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            {form.formState.errors.confirmPassword.message}
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
            <span>Creating account...</span>
          </div>
        ) : (
          `Create ${isArtist ? "Artist" : "User"} Account`
        )}
      </button>
    </form>
  );
};
