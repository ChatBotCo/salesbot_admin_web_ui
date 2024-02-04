import {createContext, useContext, useEffect} from "react";
import {useAuth} from "./use-auth";
import {useApi} from "./use-api";

const HubspotContext = createContext();

export const HubspotProvider = ({ children }) => {

  const {
    fetchWithData, fetchNoData,
  } = useApi()

  useEffect(() => {
  },[]);

  return (
    <HubspotContext.Provider
      value={{
      }}
    >
      {children}
    </HubspotContext.Provider>
  );
};

export const useHubspot = () => {
  const context = useContext(HubspotContext);
  if (!context) {
    throw new Error("use-hubspot must be used within a HubspotContext");
  }
  return context;
};
