import { createContext, useContext, useState, useEffect } from "react";
import {useUtilities} from "./useUtilities.jsx";

const CompanyContext = createContext();



let initialized = false

export const CompanyProvider = ({ children }) => {
  const {
    backendUrl,
    setLoading,
    debugging,
  } = useUtilities();

  const [companyLoadError, setCompanyLoadError] = useState(false)
  const [companyId, setCompanyId] = useState()

  const [company, setCompany] = useState()

  useEffect(() => {
    if(!initialized) {
      initialized = true
      if(companyId && !company) {
        setLoading(true)
        fetch(`${backendUrl}/api/company?companyid=${companyId}`, {
          method: "GET",
        })
          .then(data=>data.json())
          .then(_company =>{
            setCompany(_company)
          })
          .catch(()=>setCompanyLoadError(true))
          .finally(()=>setLoading(false))
      }
    }
  }, []);


  return (
    <CompanyContext.Provider
      value={{
        companyId,
        company,
        companyLoadError,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyContext");
  }
  return context;
};
