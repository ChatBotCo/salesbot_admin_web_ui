import {createContext, useContext, useEffect, useState} from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-001.azurewebsites.net")
  const [loading, setLoading] = useState(false)
  const [conversationsByDate, setConversationsByDate] = useState([])

  const transformDataForChart = conversations => {
    // Step 1: Group by company_id
    const groupedByCompany = conversations.reduce((acc, conversation) => {
      if (!acc[conversation.company_id]) {
        acc[conversation.company_id] = [];
      }
      acc[conversation.company_id].push(conversation);
      return acc;
    }, {});

    // Step 2: Count conversations per epochDays for each company
    return Object.entries(groupedByCompany).map(([companyId, convs]) => {
      const countPerDay = convs.reduce((acc, conv) => {
        acc[conv.epochDays] = (acc[conv.epochDays] || 0) + 1;
        return acc;
      }, {});

      return {
        name: companyId,
        data: Object.values(countPerDay)
      };
    });
  }

  const getUniqueSortedEpochDays = conversations => {
    // Extract epochDays and remove duplicates
    const uniqueEpochDays = [...new Set(conversations.map(conv => conv.epochDays))];

    // Sort the epochDays in ascending order
    uniqueEpochDays.sort((a, b) => a - b);

    return uniqueEpochDays;
  }

  const getLast30DaysDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Format the date as 'YYYY-MM-DD' (or any other format you prefer)
      // const formattedDate = date.toISOString().split('T')[0];
      // dates.push(formattedDate);
      const epochDate = Math.floor(date.getTime() /1000 / (86400))* 86400
      dates.push(epochDate)
    }

    return dates;
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setDebugging(localStorage.getItem('debugging')==='true')
      let _backendUrl = backendUrl
      if(localStorage.getItem('local_backend') === 'true') {
        _backendUrl = "http://localhost:7071"
        setBackendUrl(_backendUrl)
      }

      // setLoading(true)
      // fetch(`${_backendUrl}/api/get_latest_conversations`, {method: "GET"})
      //   .then(data=>data.json())
      //   .then(latestConvos => {
      //     const last30DayDates = getLast30DaysDates()
      //     console.log(latestConvos)
      //     console.log(transformDataForChart(latestConvos))
      //     // console.log(getUniqueSortedEpochDays(latestConvos))
      //     // console.log(getUniqueSortedEpochDays(latestConvos).map(epochDate=>epochDate))
      //   })
      //   // .catch(()=>setCompanyLoadError(true))
      //   .finally(()=>setLoading(false))
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
