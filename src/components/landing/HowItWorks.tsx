import { useState } from "react";
import { howItWorksContent } from "@/constants/howItWorks";

const HowItWorks = () => {
  const [activeView, setActiveView] = useState<"user" | "artist">("user");

  return (
    <div className="w-full p-10 border-t border-dashed border-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-12">
          How It Works
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 backdrop-blur-sm p-1">
            <button
              onClick={() => setActiveView("user")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                activeView === "user"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setActiveView("artist")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                activeView === "artist"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Artist
            </button>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksContent[activeView].map((step, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-6xl font-bold mb-6 ">{index + 1}</div>

              <h3 className="text-5xl font-semibold text-white mb-4 font-mondwest">
                {step.title}
              </h3>

              <p className="text-white/80 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
