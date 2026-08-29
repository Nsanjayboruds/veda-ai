"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, AlertCircle, ArrowRight, User } from "lucide-react";
import { useAssessmentStore } from "@/lib/store";
import { AssessmentDocument } from "@/types/assessment";
import { clsx } from "clsx";

type UploadAreaProps = {
  title: React.ReactNode;
  document: AssessmentDocument | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept: string;
};

const UploadArea = ({ title, document, onUpload, onRemove, accept }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  if (document) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#D1D5DB] rounded-[20px] h-[180px] bg-white relative">
        <div className="bg-[#F3F4F6] rounded-xl pl-3 pr-6 py-3 flex items-center gap-3 relative min-w-[260px] max-w-[90%]">
          {/* Close button on the pill */}
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }} 
            className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-[#4B5563] hover:bg-[#374151] flex items-center justify-center shadow-sm z-10 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
          
          {/* PDF Icon */}
          <div className="w-8 h-8 bg-[#EF4444] rounded flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[10px]">PDF</span>
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-[#1F2937] text-[13px] truncate" title={document.file.name}>
              {document.file.name}
            </h3>
            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">
              {(document.file.size / 1024 / 1024).toFixed(1)}MB • 1 Page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={clsx(
        "flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#D1D5DB] rounded-[20px] h-[180px] cursor-pointer transition-all duration-200 group relative overflow-hidden bg-white",
        isDragging && "border-orange-400 bg-orange-50 scale-[1.02]" 
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      
      {/* Icon inside gray rounded square */}
      <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#E5E7EB]">
        {/* We use standard lucide upload arrow instead of cloud */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      
      <h3 className="font-semibold text-[#1F2937] text-[17px] tracking-tight mb-1">{title}</h3>
      <p className="text-[13px] text-[#9CA3AF] font-medium">
        Max 10MB
      </p>
    </div>
  );
};

export const FileUploader = () => {
  const { questionPaper, answerSheet, setQuestionPaper, setAnswerSheet, setStatus, setProcessingProgress } = useAssessmentStore();
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (type: 'question' | 'answer', file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload PDF, PNG, JPG, or WEBP.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(`File is too large. Maximum size is 10MB.`);
      return;
    }

    let pages = 1;
    if (file.type === 'application/pdf') {
      try {
        const buffer = await file.arrayBuffer();
        const text = new TextDecoder('ascii').decode(buffer);
        // Basic PDF parsing to count pages
        const matches = text.match(/\/Type\s*\/Page\b/g);
        if (matches && matches.length > 0) {
          pages = matches.length;
        } else {
          const countMatch = text.match(/\/Count\s+(\d+)/);
          if (countMatch && countMatch[1]) {
            pages = parseInt(countMatch[1], 10);
          }
        }
      } catch (e) {
        console.error("Failed to parse PDF pages", e);
      }
    }

    const doc: AssessmentDocument = {
      file,
      previewUrl: URL.createObjectURL(file),
      pages
    };

    if (type === 'question') {
      setQuestionPaper(doc);
    } else {
      setAnswerSheet(doc);
    }
  };

  const handleProcess = async () => {
    if (!questionPaper || !answerSheet) return;
    
    setStatus('processing');
    setProcessingProgress(0, 'Extracting...');
    
    // Simulate minimalist extracting state
    const stages = [
      { progress: 20, msg: 'Extracting...' },
      { progress: 50, msg: 'Extracting...' },
      { progress: 80, msg: 'Extracting...' },
      { progress: 100, msg: 'Complete' }
    ];

    for (const stage of stages) {
      await new Promise(r => setTimeout(r, 800));
      setProcessingProgress(stage.progress, stage.msg);
    }

    await useAssessmentStore.getState().loadDemoData();
  };

  const canProcess = questionPaper && answerSheet;

  return (
    <div className="flex flex-col items-center w-full max-w-[900px] mx-auto mt-4">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 w-full max-w-2xl text-sm font-medium border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Header matching Figma exactly */}
      <div className="text-center mb-6 md:mb-8 mt-2 md:mt-0">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <h1 className="text-[34px] font-bold tracking-tight text-[#1F2937] mb-3">
            Upload{' '}
            <span className="text-[#FF5722] bg-[#FFEDE8] px-4 py-1 rounded-[14px] inline-block">
              Question Paper & Answer Sheets
            </span>
          </h1>
          <p className="text-slate-600 font-medium text-[16px]">
            Upload both files to get started
          </p>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center px-4">
          <h1 className="text-[26px] font-bold tracking-tight text-[#1F2937] leading-[1.3]">
            Upload Question Paper<br />& Answer Sheets
          </h1>
        </div>
      </div>

      {/* Illustration Mock (Exact Figma Translation) */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '13.2029px 12.0027px',
          gap: '2px',
          isolation: 'isolate',
          width: '137.03px',
          height: '138.03px',
          flex: 'none',
          flexGrow: 0,
          position: 'relative',
        }}
        className="mb-8 mx-auto"
      >
        {/* Frame 1618872256 — background circles + avatar image, order:0 z-index:0 */}
        <div style={{
          position: 'absolute',
          width: '138.03px',
          height: '138.03px',
          left: '0px',
          top: 'calc(50% - 69.015px)',
          zIndex: 0,
        }}>
          {/* Ellipse 6 — outer peach halo */}
          <div style={{
            position: 'absolute',
            width: '138.03px',
            height: '138.03px',
            left: '0px',
            top: '0px',
            background: 'rgba(255, 86, 35, 0.1)',
            backdropFilter: 'blur(1.70038px)',
            borderRadius: '50%',
          }} />

          {/* Ellipse 7 — inner orange circle */}
          <div style={{
            position: 'absolute',
            width: '108.02px',
            height: '108.02px',
            left: 'calc(50% - 54.01px)',
            top: '15.6px',
            background: 'rgba(255, 86, 35, 0.26)',
            borderRadius: '50%',
          }} />

          {/* Ellipse 3 — white circle base behind avatar */}
          <div style={{
            position: 'absolute',
            width: '78.62px',
            height: '77.78px',
            left: '30.21px',
            top: '30.33px',
            background: '#FFFFFF',
            borderRadius: '50%',
          }} />

          {/* Teacher Avatar Image — full upper body, left:30.21px top:11.4px per Figma */}
          <img
            src="/image-Photoroom(1).png"
            alt="Teacher Illustration"
            style={{
              position: 'absolute',
              width: '78.62px',
              height: '96.82px',
              left: '30.21px',
              top: '11.4px',
              borderRadius: '52.7451px',
              objectFit: 'contain',
              objectPosition: 'top center',
            }}
          />
        </div>

        {/* Frame 1618872257 — floating icon badges, order:1 z-index:1 */}
        <div style={{
          width: '113.03px',
          height: '111.42px',
          position: 'relative',
          zIndex: 1,
          flex: 'none',
          flexGrow: 0,
        }}>
          {/* Frame 3 — Task Square icon (left middle) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '12.8px', height: '12.8px', left: '0px', top: '32.41px', background: 'linear-gradient(121.62deg, #FB975D 30.95%, #FC5E24 69.77%)', borderRadius: '175.031px' }}>
            <FileText size={7} color="white" strokeWidth={3} />
          </div>

          {/* Frame 4 — Cloud / Upload icon (right middle) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '12.8px', height: '12.8px', left: '100.22px', top: '69.82px', background: 'linear-gradient(121.62deg, #FB975D 30.95%, #FC5E24 69.77%)', borderRadius: '175.031px' }}>
            <UploadCloud size={7} color="white" strokeWidth={3} />
          </div>

          {/* Frame 2 — Clock icon (top right) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '12.8px', height: '12.8px', left: '70.82px', top: '0px', background: 'linear-gradient(121.62deg, #FB975D 30.95%, #FC5E24 69.77%)', borderRadius: '175.031px' }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>

          {/* Frame 5 — Settings icon (bottom center) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '12.8px', height: '12.8px', left: '27.81px', top: '98.62px', background: 'linear-gradient(121.62deg, #FB975D 30.95%, #FC5E24 69.77%)', borderRadius: '175.031px' }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
        </div>
      </div>


      {/* Upload Cards Side by Side - EXACT Figma match */}
      <div className="bg-[#F3F4F6] p-3 md:p-5 rounded-[28px] w-full mb-12">
        <div className="grid md:grid-cols-2 gap-3 md:gap-5 w-full">
          <UploadArea
            title={<span className="text-[17px] font-bold text-[#1F2937]">Upload <span className="text-[#FF5722]">Question Paper</span></span>}
            document={questionPaper}
            onUpload={(f) => handleUpload('question', f)}
            onRemove={() => {
              if (questionPaper) URL.revokeObjectURL(questionPaper.previewUrl);
              setQuestionPaper(null);
            }}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
          />
          
          <UploadArea
            title={<span className="text-[17px] font-bold text-[#1F2937]">Upload <span className="text-[#FF5722]">Answer Sheet</span></span>}
            document={answerSheet}
            onUpload={(f) => handleUpload('answer', f)}
            onRemove={() => {
              if (answerSheet) URL.revokeObjectURL(answerSheet.previewUrl);
              setAnswerSheet(null);
            }}
            accept=".pdf,.png,.jpg,.jpeg,.webp"
          />
        </div>
      </div>

      {/* Action Button - Exact Figma Match */}
      <button 
        onClick={handleProcess}
        disabled={!canProcess}
        className={clsx(
          "h-[46px] rounded-full px-8 text-[15px] font-medium flex items-center justify-center gap-2 mx-auto transition-all",
          !canProcess
            ? "bg-[#D1D5DB] text-[#6B7280] cursor-not-allowed" 
            : "bg-[#2D2D2D] text-white hover:bg-[#1f1f1f] shadow-md"
        )}
      >
        Start Mapping
        <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
      <p className="text-[14px] font-medium text-slate-400 mt-5 max-w-md text-center">
        Once both files are uploaded, you'll able to map answers with questions
      </p>
    </div>
  );
};
