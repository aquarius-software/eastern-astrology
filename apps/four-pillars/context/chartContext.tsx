'use client';

import { createContext, useContext, useState } from "react";

type ChartContextType = {
  isFormView: boolean
  setIsFormView: (value: boolean) => void
  isJapanese: boolean
  setIsJapanese: (value: boolean) => void
}

const ChartContext = createContext<ChartContextType>({
  isFormView: false,
  setIsFormView: () => { },
  isJapanese: false,
  setIsJapanese: () => { },
})

export const ChartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFormView, setIsFormView] = useState<boolean>(false);
  const [isJapanese, setIsJapanese] = useState<boolean>(true);

  return (
    <ChartContext.Provider value={{ isFormView, setIsFormView, isJapanese, setIsJapanese }
    }>
      {children}
    </ChartContext.Provider>
  )
};

export const useChartContext = () => useContext(ChartContext);