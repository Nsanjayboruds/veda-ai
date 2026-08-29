import React from "react";
import { LayoutGrid, Presentation, FileText, ClipboardList, PieChart, Settings, Sparkles, PanelLeft } from "lucide-react";
import { clsx } from "clsx";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  isMobileOverlay?: boolean;
};

export const Sidebar = ({ isOpen, onToggle, isMobileOverlay }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutGrid, label: "Home", active: false },
    { icon: Presentation, label: "My Classroom", active: false },
    { icon: FileText, label: "Assignments", active: false },
    { icon: ClipboardList, label: "Exams", active: true },
    { icon: PieChart, label: "My Library", active: false },
  ];

  return (
    <aside 
      className={clsx(
        "bg-[#FFFFFF] hidden md:flex flex-col shrink-0 z-20 transition-all duration-300 ease-in-out rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-4 ml-4",
        isMobileOverlay ? "flex shadow-2xl m-0 rounded-none h-full" : "h-[calc(100vh-32px)]",
        isOpen ? "w-[260px]" : "w-[88px]"
      )}
    >
      {/* Logo */}
      <div className={clsx("h-[88px] flex items-center pt-2 transition-all duration-300", isOpen ? "px-6 justify-between" : "justify-center px-0")}>
        <div className="flex items-center gap-3 font-bold text-[24px] text-[#1F2937] tracking-tight">
          <div className="w-[42px] h-[42px] bg-[#292929] rounded-[12px] flex items-center justify-center text-white shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4L11 16L13.5 11L9.5 4H5Z" />
              <path d="M12.5 16L19 4H15L10.5 12L12.5 16Z" opacity="0.8"/>
            </svg>
          </div>
          {isOpen && <span className="whitespace-nowrap transition-opacity duration-300">VedaAI</span>}
        </div>
        {isOpen && (
          <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <PanelLeft className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className={clsx("py-4 mb-2 transition-all duration-300", isOpen ? "px-5" : "px-3")}>
        {/* AI Teacher's Toolkit button with Orange shadow/border */}
        <div className={clsx(
          "rounded-full p-[3px] bg-gradient-to-r from-[#FF6A3D] to-[#FF8A65] shadow-[0_4px_12px_rgba(255,106,61,0.3)] transition-all duration-300",
          !isOpen && "flex justify-center"
        )}>
          <button 
            title={!isOpen ? "AI Teacher's Toolkit" : undefined}
            className={clsx(
              "bg-[#2D2D2D] text-white rounded-full flex items-center gap-2.5 text-[15px] font-medium hover:bg-[#1f1f1f] transition-all duration-300 overflow-hidden",
              isOpen ? "w-full py-[10px] px-4 justify-center" : "w-10 h-10 justify-center px-0"
            )}
          >
            <Sparkles className="w-4 h-4 text-white fill-white shrink-0" />
            {isOpen && <span className="whitespace-nowrap transition-opacity duration-300">AI Teacher's Toolkit</span>}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            title={!isOpen ? item.label : undefined}
            onClick={!isOpen ? onToggle : undefined} // Clicking an icon when collapsed opens the sidebar
            className={clsx(
              "flex items-center gap-4 py-3 rounded-xl transition-all duration-300",
              isOpen ? "w-full px-4 text-[16px]" : "w-12 h-12 justify-center mx-auto px-0",
              item.active 
                ? "bg-[#F3F4F6] text-[#1F2937] font-medium" 
                : "text-[#888888] hover:text-[#1F2937] hover:bg-slate-50 font-normal"
            )}
          >
            <item.icon className={clsx("w-[22px] h-[22px] shrink-0", item.active ? "text-[#1F2937]" : "text-[#888888]")} strokeWidth={item.active ? 2.5 : 2} />
            {isOpen && <span className="whitespace-nowrap transition-opacity duration-300">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={clsx("p-5 flex flex-col gap-4 overflow-hidden border-t border-slate-100", !isOpen && "items-center px-2")}>
        <button 
          title={!isOpen ? "Settings" : undefined}
          className={clsx(
            "flex items-center gap-3 py-2 font-medium text-slate-500 hover:text-slate-900 transition-colors",
            isOpen ? "w-full px-2 text-sm" : "justify-center"
          )}
        >
          <Settings className="w-5 h-5 shrink-0 text-slate-400" />
          {isOpen && <span className="whitespace-nowrap">Settings</span>}
        </button>
        
        <div className={clsx(
          "flex items-center gap-3 bg-[#F8FAFC] border border-slate-100 transition-all duration-300 cursor-pointer",
          isOpen ? "p-3 rounded-2xl w-full" : "p-1.5 rounded-full justify-center w-12 h-12"
        )}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shrink-0 shadow-sm p-1.5">
             {/* Fake school logo */}
             <div className="w-full h-full border-2 border-emerald-600 rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-emerald-600 rounded-full" />
             </div>
          </div>
          {isOpen && (
            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">Delhi Public School</p>
              <p className="text-[11px] text-slate-500 truncate font-medium">Bokaro Steel City</p>
            </div>
          )}
        </div>
        
        {!isOpen && (
          <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 mt-2 flex justify-center w-full pb-2">
            <PanelLeft className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>
    </aside>
  );
};
