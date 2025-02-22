import React, { useState, useEffect } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import WalletButton from "./WalletButton";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setDarkMode(mediaQuery.matches);

      const handleChange = () => setDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  return (
    <div className="flex w-full items-center flex-col">
      <header className="w-full h-16 px-4 flex shadow-lg justify-between items-center rounded-xl bg-gray-600 dark:bg-gray-800 text-white">
        <h1 className="font-bold text-xl font-mono">Voting</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-500 dark:bg-gray-900 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
          <WalletButton />
        </div>
      </header>
    </div>
  );
};

export default Header;
