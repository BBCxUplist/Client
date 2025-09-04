import type { AuthMode } from "./types";

interface AuthHeaderProps {
  activeMode: AuthMode;
}

const AuthHeader = ({ activeMode }: AuthHeaderProps) => {
  return (
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
  );
};

export default AuthHeader;
