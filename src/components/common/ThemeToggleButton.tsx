import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { FiMoon } from "react-icons/fi";

export const ThemeToggleButton: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
      <MdOutlineWbSunny size={25} className="hidden dark:block" />
      <FiMoon size={25} className="dark:hidden" />
    </button>
  );
};
