"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import React, { useState ,useEffect,useRef} from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      localStorage.setItem("isExpanded", isExpanded ? "false" : "true");
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex flex-col w-full bg-white border-gray-200 z-1 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-1 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border" onClick={handleToggle} aria-label="Toggle Sidebar" >
            {isMobileOpen ? (
              <IoClose size={25} />
            ) : (
              <HiMenuAlt1 size={25} />
            )}
          </button>
        </div>
        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} flex-col lg:flex-row lg:items-center justify-between w-full gap-4 px-1 py-4 lg:px-6 lg:flex shadow-theme-md lg:justify-end lg:shadow-none`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationDropdown />
            <ThemeToggleButton />
            <UserDropdown /> 
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
