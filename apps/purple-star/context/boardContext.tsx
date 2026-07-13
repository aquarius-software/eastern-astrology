"use client";

import { createContext, useContext, useState } from "react";
import { LunarMonth } from "types";

type BoardContextType = {
  isFormView: boolean;
  setIsFormView: (value: boolean) => void;
  isJapanese: boolean;
  setIsJapanese: (value: boolean) => void;
  currentMonth: LunarMonth | null;
  setCurrentMonth: (value: LunarMonth) => void;
  currentPalace: number;
  setCurrentPalace: (value: number) => void;
  showChildStar: boolean;
  setShowChildStar: (value: boolean) => void;
  showSelfChildStar: boolean;
  setShowSelfChildStar: (value: boolean) => void;
  showDiagonalChildStar: boolean;
  setShowDiagonalChildStar: (value: boolean) => void;
  showMainChildStar: boolean;
  setShowMainChildStar: (value: boolean) => void;
};

const BoardContext = createContext<BoardContextType>({
  isFormView: false,
  setIsFormView: () => { },
  isJapanese: false,
  setIsJapanese: () => { },
  currentMonth: null,
  setCurrentMonth: () => { },
  currentPalace: -1,
  setCurrentPalace: () => { },
  showChildStar: false,
  setShowChildStar: () => { },
  showSelfChildStar: false,
  setShowSelfChildStar: () => { },
  showDiagonalChildStar: false,
  setShowDiagonalChildStar: () => { },
  showMainChildStar: false,
  setShowMainChildStar: () => { }
});

export const BoardContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isFormView, setIsFormView] = useState<boolean>(false);
  const [isJapanese, setIsJapanese] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<LunarMonth | null>(
    null
  );
  const [currentPalace, setCurrentPalace] = useState<number>(-1);
  const [showChildStar, setShowChildStar] = useState<boolean>(true);
  const [showSelfChildStar, setShowSelfChildStar] = useState<boolean>(false);
  const [showDiagonalChildStar, setShowDiagonalChildStar] = useState<boolean>(false);
  const [showMainChildStar, setShowMainChildStar] = useState<boolean>(false);

  return (
    <BoardContext.Provider
      value={{
        isFormView,
        setIsFormView,
        isJapanese,
        setIsJapanese,
        currentMonth,
        setCurrentMonth,
        currentPalace,
        setCurrentPalace,
        showChildStar,
        setShowChildStar,
        showSelfChildStar,
        setShowSelfChildStar,
        showDiagonalChildStar,
        setShowDiagonalChildStar,
        showMainChildStar,
        setShowMainChildStar,
      }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => useContext(BoardContext);
