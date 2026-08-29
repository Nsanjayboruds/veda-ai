"use client";

import React, { useState } from "react";
import { QuestionList } from "@/components/questions/QuestionList";
import { AnswerViewer } from "@/components/viewer/AnswerViewer";

export const ResultsDashboard = () => {
  // Mobile active tab state (since the Figma screenshot has mobile variations)
  const [activeTab, setActiveTab] = useState<"questions" | "viewer">("questions");

  return (
    <div className="flex flex-col h-full bg-transparent w-full overflow-hidden p-2 md:p-6 pb-0">
      {/* Main Content Floating Container */}
      <div className="flex-1 flex overflow-hidden bg-[#F3F4F6] rounded-t-[24px] shadow-sm border border-white/40">
        {/* Left Sidebar (Questions) */}
        <div className={`w-full md:w-[420px] lg:w-[480px] shrink-0 bg-[#F3F4F6] flex flex-col z-10 shadow-[4px_0_15px_rgba(0,0,0,0.02)] ${activeTab === 'viewer' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex-1 overflow-hidden flex flex-col">
            <QuestionList onQuestionSelect={() => setActiveTab('viewer')} />
          </div>
        </div>

        {/* Right Content (Viewer) */}
        <div className={`flex-1 bg-white flex flex-col overflow-hidden relative ${activeTab === 'questions' ? 'hidden md:flex' : 'flex'}`}>
          <AnswerViewer />
        </div>
      </div>
    </div>
  );
};
