import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./use-auth";

const ApiContext = createContext();

let initialized = false

export const ApiProvider = ({ children }) => {
  const {setAuthBackendUrl, user} = useAuth()

  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-api-svc.azurewebsites.net")

  const [countPerDayByCompanyId, setCountPerDayByCompanyId] = useState({})
  const [msgCountPerDayByCompanyId, setMsgCountPerDayByCompanyId] = useState({})
  const [companiesByCompanyId, setCompaniesByCompanyId] = useState({})
  const [chatbotsByCompanyId, setChatbotsByCompanyId] = useState({})
  const [conversationsByCompanyId, setConversationsByCompanyId] = useState({})
  const [conversationsForBlackTie, setConversationsForBlackTie] = useState([])
  const [conversationsForEdge, setConversationsForEdge] = useState([])
  const [conversationsForSalesBot, setConversationsForSalesBot] = useState([])
  const [messagesForConvoId, setMessagesForConvoId] = useState([])
  const [messageCountsPerConvo, setMessageCountsPerConvo] = useState({})
  const [companyIdParam, setCompanyIdParam] = useState("")
  const [navToMsgsFromLeadsTable, setNavToMsgsFromLeadsTable] = useState(false)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSaveResults, setShowSaveResults] = useState(false)
  const [saveResults, setSaveResults] = useState('')
  const [saveResultsSeverity, setSaveResultsSeverity] = useState('success')

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

  const reloadChatbots = () => {
    return fetch(`${backendUrl}/api/chatbots?company_id=${user.company_id}`, {method: "GET"})
      .then(data=>data.json())
      .then(_companies => {
        let result = _companies.reduce((acc, company) => {
          acc[company.company_id] = company
          return acc;
        }, {});
        setChatbotsByCompanyId(result)
      })
  }

  const loadAllDataForAuthorizedUser = () => {
    if(user && user.company_id) {
      if(window.location.pathname === '/messages') {
        const urlParams = new URLSearchParams(window.location.search);
        const convo_id = urlParams.get('convo_id');
        const from_leads = urlParams.get('from_leads');
        if(convo_id) {
          setNavToMsgsFromLeadsTable(from_leads === 'true')
          fetch(`${backendUrl}/api/messages?convo_id=${convo_id}`, {method: "GET"})
            .then(data=>data.json())
            .then(setMessagesForConvoId)
        }
      }

      setLoading(true)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const epochSeconds30DaysAgo = Math.floor(thirtyDaysAgo.getTime() / 1000);
      const promises = [
        fetch(`${backendUrl}/api/companies?company_id=${user.company_id}`, {method: "GET"})
          .then(data=>data.json())
          .then(_companies => {
            let result = _companies.reduce((acc, company) => {
              acc[company.company_id] = company
              return acc;
            }, {});
            setCompaniesByCompanyId(result)
          }),

        reloadChatbots(),

        fetch(`${backendUrl}/api/conversations?company_id=${user.company_id}&since_timestamp=${epochSeconds30DaysAgo}`, {method: "GET"})
          .then(data=>data.json())
          .then(convos => {
            const dayStartBuckets = getDayStartBuckets()
            const _countPerDayByCompanyId = transformDataForChart(convos, dayStartBuckets)
            setCountPerDayByCompanyId(_countPerDayByCompanyId)

            let result = convos.reduce((acc, convo) => {
              if(!acc[convo.company_id]) acc[convo.company_id] = []
              acc[convo.company_id].push(convo)
              return acc;
            }, {});
            setConversationsByCompanyId(result)
          }),

        fetch(`${backendUrl}/api/messages?latest=true&company_id=${user.company_id}`, {method: "GET"})
          .then(data=>data.json())
          .then(latestMsgs => {
            const dayStartBuckets = getDayStartBuckets()
            const _countPerDayByCompanyId = transformDataForChart(latestMsgs, dayStartBuckets)
            setMsgCountPerDayByCompanyId(_countPerDayByCompanyId)
          }),

        fetch(`${backendUrl}/api/messages/count_per_convo?company_id=${user.company_id}`, {method: "GET"})
          .then(data=>data.json())
          .then(msgCountsPerConvo => {
            let result = msgCountsPerConvo.reduce((acc, obj) => {
              acc[obj.conversation_id] = obj.many_msgs;
              return acc;
            }, {})
            setMessageCountsPerConvo(result)
          }),
      ]
      Promise.all(promises)
        .finally(()=>setLoading(false))
    }
  }

  const clearAllDataForAuthorizedUser = () => {
    setCountPerDayByCompanyId({})
    setMsgCountPerDayByCompanyId({})
    setConversationsForBlackTie([])
    setConversationsForEdge([])
    setConversationsForSalesBot([])
  }

  const saveChatbotChanges = updatedChatbotValues => {
    setSaving(true)
    fetch(`${backendUrl}/api/chatbots`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedChatbotValues),
    })
      .then(data=> {
        if(data.status === 204) {
          setSaveResults('Chatbot saved')
          setSaveResultsSeverity('success')
          reloadChatbots()
        } else {
          setSaveResults('There was an error saving the chatbot')
          setSaveResultsSeverity('error')
        }
        setShowSaveResults(true)
      })
      .finally(()=>setSaving(false))
  }

  const createCompany = (newCompany) => {
    setSaving(true)
    fetch(`${backendUrl}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...newCompany, user_id:user.id}),
    })
      .then(data=> {
        console.log(data)
        if(data.status === 200) {
          data.json()
            .then(newCompany=>{
              console.log(newCompany)
              setSaveResults('Company information saved')
              setSaveResultsSeverity('success')
              user.company_id = newCompany.company_id
              console.log(user)
              window.localStorage.setItem('authorizeUserdata', JSON.stringify(user));
              window.location.reload()
            })
        } else {
          setSaveResults('There was an error saving the chatbot')
          setSaveResultsSeverity('error')
        }
      })
      .catch(()=>{
        setSaveResults('There was an error saving your company information')
        setSaveResultsSeverity('error')
      })
      .finally(()=>setSaving(false))
  }

  // On User object update (auth change)
  useEffect(() => {
    clearAllDataForAuthorizedUser()
    loadAllDataForAuthorizedUser()
  },[user]);

  useEffect(() => {
    // if (typeof window !== 'undefined' && window.localStorage) {
    setDebugging(localStorage.getItem('debugging')==='true')
    let _backendUrl = backendUrl
    if(localStorage.getItem('local_backend') === 'true') {
      _backendUrl = "http://localhost:5000"
      setBackendUrl(_backendUrl)
    }
    setAuthBackendUrl(_backendUrl)
  }, []);

  const handleDismissSaveResults  = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSaveResults(false);
  };

  return (
    <ApiContext.Provider
      value={{
        backendUrl,
        loading, setLoading,
        debugging,
        conversationsForBlackTie,
        conversationsForEdge,
        conversationsForSalesBot,
        messagesForConvoId,
        getDayStartBuckets,
        countPerDayByCompanyId,
        msgCountPerDayByCompanyId,
        companyIdParam,
        conversationsByCompanyId,
        companiesByCompanyId,
        messageCountsPerConvo,
        navToMsgsFromLeadsTable,
        chatbotsByCompanyId,
        saveChatbotChanges,
        showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity, saving,
        createCompany,
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
