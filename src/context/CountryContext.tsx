"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Country = {
  name: string;
  code: string;
};

type CountryContextType = {
  country: Country;
  setCountry: (country: Country) => void;
};

const defaultCountry = { name: "United States", code: "us" };

const CountryContext = createContext<CountryContextType>({
  country: defaultCountry,
  setCountry: () => {},
});

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>(defaultCountry);

  useEffect(() => {
    // Load from localStorage on mount
    const storedName = localStorage.getItem("selectedCountryName");
    const storedCode = localStorage.getItem("selectedCountryCode");

    if (storedName && storedCode) {
      setCountryState({ name: storedName, code: storedCode });
    }
  }, []);

  function setCountry(country: Country) {
    localStorage.setItem("selectedCountryName", country.name);
    localStorage.setItem("selectedCountryCode", country.code);
    setCountryState(country);
  }

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
