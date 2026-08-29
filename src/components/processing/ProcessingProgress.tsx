"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const ProcessingProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Animated Sparkle Icon */}
      <div className="relative mb-6">
        <Sparkles className="w-20 h-20 text-orange-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-75" />
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75 delay-150" />
      </div>
      
      {/* Text matching Figma */}
      <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">
        Extracting...
      </h2>
      <p className="text-sm font-medium text-slate-500">
        This may take a while
      </p>
    </div>
  );
};
