"use client";

import React, { useMemo } from "react";
import { useAssessmentStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const GradingSummary = () => {
  const { questions, mappings, grading } = useAssessmentStore();

  const stats = useMemo(() => {
    const total = questions.length;
    const answered = mappings.filter(m => m.questionId !== null).length;
    const unmatched = mappings.filter(m => m.questionId === null).length;
    
    let score = 0;
    let maxScore = 0;
    
    grading.forEach(g => {
      score += g.score;
      maxScore += g.maxScore;
    });

    return { total, answered, unmatched, score, maxScore };
  }, [questions, mappings, grading]);

  const percentage = stats.maxScore > 0 ? Math.round((stats.score / stats.maxScore) * 100) : 0;

  return (
    <div className="p-4 border-b bg-white shrink-0">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Assessment Summary</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-3 shadow-none bg-slate-50 border-slate-100">
          <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Answered</div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.answered} <span className="text-sm font-normal text-slate-400">/ {stats.total}</span>
          </div>
        </Card>
        
        {stats.maxScore > 0 ? (
          <Card className="p-3 shadow-none bg-primary/5 border-primary/10">
            <div className="text-xs text-primary/70 font-medium mb-1 uppercase tracking-wider">Score</div>
            <div className="text-2xl font-bold text-primary">
              {stats.score} <span className="text-sm font-normal text-primary/50">/ {stats.maxScore}</span>
            </div>
          </Card>
        ) : (
          <Card className="p-3 shadow-none bg-amber-50 border-amber-100">
            <div className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wider">Unmatched</div>
            <div className="text-2xl font-bold text-amber-700">
              {stats.unmatched}
            </div>
          </Card>
        )}
      </div>

      {stats.maxScore > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Overall Grade</span>
            <span className="text-slate-900">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      )}
    </div>
  );
};
