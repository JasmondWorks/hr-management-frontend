"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderState {
  pageHeader: ReactNode;
  subHeader?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

interface HeaderContextType {
  headerState: HeaderState;
  setHeaderState: React.Dispatch<React.SetStateAction<HeaderState>>;
}

const HeaderStateContext = createContext<HeaderState | undefined>(undefined);
const HeaderSetContext = createContext<React.Dispatch<React.SetStateAction<HeaderState>> | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerState, setHeaderState] = useState<HeaderState>({
    pageHeader: "",
  });

  return (
    <HeaderSetContext.Provider value={setHeaderState}>
      <HeaderStateContext.Provider value={headerState}>
        {children}
      </HeaderStateContext.Provider>
    </HeaderSetContext.Provider>
  );
}

export function useHeader() {
  const state = useContext(HeaderStateContext);
  const set = useContext(HeaderSetContext);
  if (!state || !set) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return { headerState: state, setHeaderState: set };
}

export function useSetHeader(state: HeaderState) {
  const setHeaderState = useContext(HeaderSetContext);
  if (!setHeaderState) {
    throw new Error("useSetHeader must be used within a HeaderProvider");
  }

  React.useEffect(() => {
    setHeaderState(state);
    return () => {
      setHeaderState({ pageHeader: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.pageHeader, 
    state.subHeader, 
    state.searchValue, 
    state.onSearchChange
  ]);
}
