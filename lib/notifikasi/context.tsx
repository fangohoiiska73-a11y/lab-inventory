"use client";

import { createContext, useContext, useState } from "react";

type NotifikasiContextType = {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
};

const NotifikasiContext = createContext<NotifikasiContextType | null>(null);

export function NotifikasiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotifikasiContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </NotifikasiContext.Provider>
  );
}

export function useNotifikasi() {
  const context = useContext(NotifikasiContext);

  if (!context) {
    throw new Error(
      "useNotifikasi harus digunakan di dalam NotifikasiProvider"
    );
  }

  return context;
}