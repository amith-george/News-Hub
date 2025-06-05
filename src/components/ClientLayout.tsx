'use client';

import { useState } from "react"; // ⛔ Removed `useEffect`
import Loader from "./Loader";
import Navbar from "./Navbar";
import NewsHeader from "./NewsHeader";
import { CountryProvider } from "@/context/CountryContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader] = useState(true); // ⛔ Don't include `setShowLoader` since it's unused

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
