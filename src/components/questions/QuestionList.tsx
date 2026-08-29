"use client";

import React, { useMemo } from "react";
import { useAssessmentStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clsx } from "clsx";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export const QuestionList = ({ onQuestionSelect }: { onQuestionSelect?: () => void }) => {
  const { questions, answers, mappings, grading, selectedQuestionId, setSelectedQuestionId } = useAssessmentStore();

  const handleSelect = (id: string) => {
    setSelectedQuestionId(id);
    onQuestionSelect?.();
  };

  // Calculate total score
  const { totalScore, maxPossibleScore } = useMemo(() => {
    let score = 0;
    let max = 0;
    questions.forEach(q => {
      max += q.marks || 0;
    });
    grading.forEach(g => {
      score += g.score;
    });
    return { totalScore: score, maxPossibleScore: max };
  }, [questions, grading]);

  // Find unmatched answers
  const unmatchedAnswers = useMemo(() => {
    return mappings.filter(m => m.questionId === null).map(m => {
      return answers.find(a => a.id === m.answerId);
    }).filter(Boolean);
  }, [mappings, answers]);

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6]">
      <div className="px-6 py-5 flex items-center justify-between sticky top-0 z-10 shrink-0 bg-[#F3F4F6]">
        <h3 className="font-bold text-[15px] text-[#1F2937]">Extracted Questions <span className="font-normal text-[#6B7280]">(from question paper)</span></h3>
        <button className="bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[12px] font-bold text-[#1F2937] hover:bg-slate-50 transition-colors">
          Expand All
        </button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0 space-y-3">
          {questions.map((q) => {
            const isSelected = selectedQuestionId === q.id;
            const mapping = mappings.find(m => m.questionId === q.id);
            const isAnswered = !!mapping;
            const grade = grading.find(g => g.questionId === q.id);
            const scoreText = grade ? `${grade.score}/${grade.maxScore}` : isAnswered ? `?/${q.marks}` : `Not Attempted`;
            
            // Determine pill color
            let pillColor = "text-[#6B7280]"; // Default / Not Attempted
            if (grade) {
              if (grade.status === 'correct') pillColor = "text-[#22C55E]";
              else if (grade.status === 'partially_correct') pillColor = "text-[#F97316]";
              else if (grade.status === 'incorrect') pillColor = "text-[#EF4444]";
            }
            
            // Parse 11(a) into '11' and 'a'
            const match = q.number.match(/^(\d+)\((.)\)$/);
            const mainNumber = match ? match[1] : q.number;
            const subLetter = match ? match[2] : null;

            return (
              <div 
                key={q.id}
                className={clsx(
                  "w-full text-left p-4 rounded-[16px] transition-all bg-white shadow-sm border",
                  isSelected ? "border-[#FF5722]" : "border-[#E5E7EB] hover:border-slate-300"
                )}
              >
                <div 
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => handleSelect(q.id)}
                >
                  {/* Number Circle & Sub-letter */}
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <div className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center font-bold text-[13px] text-white transition-colors shadow-sm",
                      isSelected ? "bg-[#FF5722]" : "bg-[#4B5563]"
                    )}>
                      {mainNumber}
                    </div>
                    {subLetter && (
                      <div className="w-5 h-5 rounded-full bg-[#F3F4F6] flex items-center justify-center font-bold text-[12px] text-[#4B5563]">
                        {subLetter}.
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2 pt-0.5">
                    <p className="text-[13.5px] font-medium text-[#374151] leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <div className={clsx("text-[13px] font-bold px-1", pillColor)}>
                      {scoreText}
                    </div>
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-[#F3F4F6] ml-1">
                      {isSelected ? (
                        <ChevronUp className="w-4 h-4 text-[#4B5563]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#4B5563]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Feedback - Only show if selected */}
                {isSelected && grade?.feedback && (
                  <div className="mt-4 bg-[#F8F9FA] rounded-[12px] p-4 ml-11 border border-[#F3F4F6]">
                    <h4 className="font-bold text-[12px] text-[#1F2937] mb-1">AI Feedback</h4>
                    <p className="text-[12px] text-[#4B5563] leading-relaxed">
                      {grade.feedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Unmatched Answers Section */}
          {unmatchedAnswers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <h4 className="font-bold text-[13px] text-[#1F2937] flex items-center gap-2 mb-3 px-1">
                <AlertCircle className="w-4 h-4 text-[#F97316]" />
                Unmatched Extra Answers ({unmatchedAnswers.length})
              </h4>
              <div className="space-y-3">
                {unmatchedAnswers.map((ans, idx) => (
                  <div key={idx} className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-[12px] p-3 text-[13px] text-[#374151]">
                    <span className="font-bold text-[#C2410C] mr-2">Extra Answer:</span>
                    {ans?.text || "Unknown text"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
