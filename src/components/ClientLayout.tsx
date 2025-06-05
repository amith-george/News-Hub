'use client';

import { useEffect, useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import NewsHeader from "./NewsHeader";
import { CountryProvider } from "@/context/CountryContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState<boolean | null>(null); // null = unknown screen size

  useEffect(() => {
    const mobile = window.innerWidth < 640;

    if (mobile) {
      setShowLoader(false);
      return;
    }

    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setShowLoader(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
      setShowLoader(true);

      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);


  if (showLoader === null) return null;

  return (
    <CountryProvider>
      <Navbar />
      <NewsHeader />
      {children}

      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <Loader />
        </div>
      )}
    </CountryProvider>
  );
}
