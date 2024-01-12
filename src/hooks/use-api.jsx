import {createContext, useContext, useEffect, useState} from "react";

const ApiContext = createContext();

let initialized = false

export const ApiProvider = ({ children }) => {
  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-001.azurewebsites.net")
  const [loading, setLoading] = useState(false)
  const [countPerDayByCompanyId, setCountPerDayByCompanyId] = useState({})
  const [msgCountPerDayByCompanyId, setMsgCountPerDayByCompanyId] = useState({})
  const [conversationsForBlackTie, setConversationsForBlackTie] = useState([])
  const [messagesForConvoId, setMessagesForConvoId] = useState([])
  const [conversationsWithUserData, setConversationsWithUserData] = useState([])

  const transformDataForChart = (conversations, dayStartBuckets) => {
    const companyIds = Object.keys(conversations.reduce((a, convo) => Object.assign(a, { [convo.company_id]: 0 }), {}))

    const countPerDayByCompanyId = {}
    companyIds.forEach(companyId=>{
      countPerDayByCompanyId[companyId] = dayStartBuckets.reduce((a, ts) => Object.assign(a, { [ts]: 0 }), {})
    })

    conversations.forEach(convo=>{
      const countPerDay = countPerDayByCompanyId[convo.company_id]
      dayStartBuckets.forEach((dayStartTs,i)=>{
        if(i<dayStartBuckets.length) {
          const dayEndTs = dayStartBuckets[i+1]
          if(convo._ts>=dayStartTs && convo._ts<dayEndTs) {
            countPerDay[dayStartTs] = countPerDay[dayStartTs] + 1
          } else if(!dayEndTs) {
            countPerDay[dayStartTs] = countPerDay[dayStartTs] + 1
          }
        }
      })
    })

    // console.log(countPerDayByCompanyId)
    return countPerDayByCompanyId
  }

  const getDayStartBuckets = () => {
    const timestampsMidnight = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);
      date.setUTCHours(0, 0, 0, 0);

      // Adjust for PST timezone (-8 hours from UTC)
      const pstOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      const epochDatePST = Math.floor((date.getTime() - pstOffset) / 1000);
      timestampsMidnight.push(epochDatePST);
    }

    return timestampsMidnight;
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setDebugging(localStorage.getItem('debugging')==='true')
      let _backendUrl = backendUrl
      if(localStorage.getItem('local_backend') === 'true') {
        _backendUrl = "http://localhost:7071"
        setBackendUrl(_backendUrl)
      }

      if(!initialized) {
        initialized = true
        fetch(`${_backendUrl}/api/get_conversations_for_company?companyid=blacktiecasinoevents`, {method: "GET"})
          .then(data=>data.json())
          .then(setConversationsForBlackTie)

        if(window.location.pathname === '/messages') {
          const urlParams = new URLSearchParams(window.location.search);
          const convo_id = urlParams.get('convo_id');
          if(convo_id) {
            fetch(`${_backendUrl}/api/get_messages_for_conversation?convoid=${convo_id}`, {method: "GET"})
              .then(data=>data.json())
              .then(setMessagesForConvoId)
          }
        }

        fetch(`${_backendUrl}/api/get_latest_conversations`, {method: "GET"})
          .then(data=>data.json())
          .then(latestConvos => {
            const dayStartBuckets = getDayStartBuckets()
            const _countPerDayByCompanyId = transformDataForChart(latestConvos, dayStartBuckets)
            setCountPerDayByCompanyId(_countPerDayByCompanyId)
          })

        fetch(`${_backendUrl}/api/get_latest_messages`, {method: "GET"})
          .then(data=>data.json())
          .then(latestMsgs => {
            const dayStartBuckets = getDayStartBuckets()
            const _countPerDayByCompanyId = transformDataForChart(latestMsgs, dayStartBuckets)
            setMsgCountPerDayByCompanyId(_countPerDayByCompanyId)
          })

        fetch(`${_backendUrl}/api/get_conversations_with_user_data`, {method: "GET"})
          .then(data=>data.json())
          .then(convos => {
            setConversationsWithUserData(convos)
          })
      }
    }
  }, []);

  return (
    <ApiContext.Provider
      value={{
        backendUrl,
        loading, setLoading,
        debugging,
        conversationsForBlackTie,
        messagesForConvoId,
        getDayStartBuckets,
        countPerDayByCompanyId,
        msgCountPerDayByCompanyId,
        conversationsWithUserData,
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
