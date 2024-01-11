import { createContext, useContext, useState, useEffect } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-001.azurewebsites.net")
  const [loading, setLoading] = useState(false)
  const [conversationsByDate, setConversationsByDate] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setDebugging(localStorage.getItem('debugging')==='true')
      let _backendUrl = backendUrl
      if(localStorage.getItem('local_backend') === 'true') {
        _backendUrl = "http://localhost:7071"
        setBackendUrl(_backendUrl)
      }

      setLoading(true)
      fetch(`${_backendUrl}/api/get_conversations_by_date`, {method: "GET"})
        .then(data=>data.json())
        .then(setConversationsByDate)
        // .catch(()=>setCompanyLoadError(true))
        .finally(()=>setLoading(false))
    }
  }, []);

  return (
    <ApiContext.Provider
      value={{
        backendUrl,
        loading, setLoading,
        debugging,
        conversationsByDate,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("use-api must be used within a ApiContext");
  }
  return context;
};
