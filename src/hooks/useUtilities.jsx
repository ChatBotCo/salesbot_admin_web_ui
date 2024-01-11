import { createContext, useContext, useState, useEffect } from "react";

let backendUrl = "https://salesbot-001.azurewebsites.net";
// if(localStorage.getItem('local_backend') === 'true') {
//   backendUrl = "http://localhost:7071"
// }

const UtilitiesContext = createContext();

export const UtilitiesProvider = ({ children }) => {
  const [debugging, setDebugging] = useState()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setDebugging(localStorage.getItem('debugging')==='true')
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
