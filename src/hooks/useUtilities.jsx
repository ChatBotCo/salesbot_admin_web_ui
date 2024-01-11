import { createContext, useContext, useState, useEffect } from "react";

const UtilitiesContext = createContext();

export const UtilitiesProvider = ({ children }) => {
  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-001.azurewebsites.net")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setDebugging(localStorage.getItem('debugging')==='true')
      if(localStorage.getItem('local_backend') === 'true') {
        setBackendUrl("http://localhost:7071")
      }
    }
  }, []);

  return (
    <UtilitiesContext.Provider
      value={{
        backendUrl,
        loading, setLoading,
        debugging,
      }}
    >
      {children}
    </UtilitiesContext.Provider>
  );
};

export const useUtilities = () => {
  const context = useContext(UtilitiesContext);
  if (!context) {
    throw new Error("useUtilities must be used within a UtilitiesContext");
  }
  return context;
};
