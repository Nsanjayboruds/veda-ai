"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAssessmentStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Maximize } from "lucide-react";

export const AnswerViewer = () => {
  const { selectedQuestionId, questions, answers, mappings, answerSheet } = useAssessmentStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(68);

  const { question, answer } = useMemo(() => {
    let q = questions.find(q => q.id === selectedQuestionId);
    let a = null;

    if (q) {
      const mapping = mappings.find(m => m.questionId === q.id);
      if (mapping) {
        a = answers.find(ans => ans.id === mapping.answerId) || null;
      }
    }

    return { question: q, answer: a };
  }, [selectedQuestionId, questions, answers, mappings]);

  useEffect(() => {
    if (answer && answer.regions.length > 0) {
      setCurrentPage(answer.regions[0].page);
    }
  }, [answer]);

  if (!selectedQuestionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F3F4F6]">
        <div className="text-center">
          <p className="text-slate-400 font-medium">Select a question to view the mapped answer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6]">
      {/* Top Action Bar matching Figma */}
      <div className="h-14 bg-[#2D2D2D] border-b border-[#374151] px-6 flex items-center justify-between shrink-0 shadow-sm z-10 rounded-t-[20px]">
        <h3 className="font-semibold text-white text-[15px]">Answer Sheet</h3>
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-[#4B5563] rounded-full p-1 border border-[#6B7280]">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-[#374151]" onClick={() => setZoom(Math.max(20, zoom - 10))}>
              <Minus className="h-3.5 w-3.5 text-white" />
            </Button>
            <span className="text-xs font-bold px-1 text-white min-w-[36px] text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-[#374151]" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <Plus className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2 bg-[#4B5563] rounded-full px-3 py-1 border border-[#6B7280]">
             <button 
               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
               className="text-slate-300 hover:text-white transition-colors"
               disabled={currentPage <= 1}
             >&lt;</button>
             <span className="text-xs font-bold px-2 text-white text-center">
               Page {currentPage} of {answerSheet?.pages || 4}
             </span>
             <button 
               onClick={() => setCurrentPage(Math.min(answerSheet?.pages || 4, currentPage + 1))}
               className="text-slate-300 hover:text-white transition-colors"
               disabled={currentPage >= (answerSheet?.pages || 4)}
             >&gt;</button>
          </div>
        </div>
      </div>

      {/* Document Canvas Area */}
      <div className="flex-1 overflow-auto p-8 relative flex items-start justify-center pb-24">
         <div 
           className="bg-white shadow-xl relative origin-top overflow-hidden"
           style={{ 
             width: '800px', 
             height: '1131px', // A4 aspect ratio 1:1.414
             transform: `scale(${zoom / 100})`,
             ...(answerSheet ? {} : {
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 31px, #93C5FD 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, #f3f4f6 32px)',
               backgroundSize: '32px 32px'
             })
           }}
         >
           {answerSheet && answerSheet.previewUrl ? (
             answerSheet.file.type.startsWith('image/') ? (
               <img src={answerSheet.previewUrl} className="w-full h-full object-contain" alt="Answer Sheet" />
             ) : (
               <iframe key={currentPage} src={`${answerSheet.previewUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-0 pointer-events-none" />
             )
           ) : (
             <>
               {/* Red margin line simulating notebook paper */}
               <div className="absolute left-12 top-0 bottom-0 w-px bg-red-200" />
               <div className="absolute left-14 top-0 bottom-0 w-px bg-red-200" />

               <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <span className="text-8xl font-bold rotate-45">PAGE {currentPage}</span>
               </div>
             </>
           )}

           {/* Render Highlight Overlays to match Figma green box */}
           {answer?.regions.filter(r => r.page === currentPage).map((region, idx) => (
             <div 
               key={idx}
               className="absolute border-[2px] border-[#22C55E] bg-[#22C55E]/5 animate-in fade-in zoom-in duration-300 rounded-[4px]"
               style={{
                 left: `${region.x * 100}%`,
                 top: `${region.y * 100}%`,
                 width: `${region.width * 100}%`,
                 height: `${region.height * 100}%`,
               }}
             >
                <div className="absolute -top-3 -left-[2px] px-2 h-[22px] bg-[#22C55E] text-white rounded-[4px] flex items-center justify-center font-bold text-[11px] shadow-sm tracking-wide">
                  Q{question?.number}
                </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};
