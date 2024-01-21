import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./use-auth";

const ApiContext = createContext();

let onboardingSteps = {
  notReady: 1,
  createCompany: 2,
  customizeChatbot: 3,
  scrapeLinks: 4,
  done: 5,
}

export const ApiProvider = ({ children }) => {
  const {
    setAuthBackendUrl,
    user,
    signOut,
    isAuthenticated,
    updateJwt,
  } = useAuth()

  const [debugging, setDebugging] = useState()
  const [backendUrl, setBackendUrl] = useState("https://salesbot-api-svc.azurewebsites.net")

  const [countPerDayByCompanyId, setCountPerDayByCompanyId] = useState({})
  const [msgCountPerDayByCompanyId, setMsgCountPerDayByCompanyId] = useState({})
  const [companiesByCompanyId, setCompaniesByCompanyId] = useState({})
  const [chatbotsByCompanyId, setChatbotsByCompanyId] = useState({})
  const [linksById, setLinksById] = useState({})
  const [conversationsByCompanyId, setConversationsByCompanyId] = useState({})
  const [conversationsForBlackTie, setConversationsForBlackTie] = useState([])
  const [conversationsForEdge, setConversationsForEdge] = useState([])
  const [conversationsForSalesBot, setConversationsForSalesBot] = useState([])
  const [messagesForConvoId, setMessagesForConvoId] = useState([])
  const [messageCountsPerConvo, setMessageCountsPerConvo] = useState({})
  const [companyIdParam, setCompanyIdParam] = useState("")
  const [navToMsgsFromLeadsTable, setNavToMsgsFromLeadsTable] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(onboardingSteps.notReady)
  const [userApprovalStatus, setUserApprovalStatus] = useState('')

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

  const fetchWithData = (url, options) =>{
    return fetchNoData(url, options)
      .then(data => data.json())
  }

  const fetchNoData = (url, options) =>{
    if(isAuthenticated) {
      options.headers = options.headers || {}
      options.headers["Authorization"] = `Bearer ${user.jwt}`
      return fetch(url, options)
        .then(data => {
          if (data.status === 401) {
            signOut()
            window.location.replace('/auth/login')
          }
          return data
        })
    }
  }

  const reloadChatbots = () => {
    return fetchWithData(`${backendUrl}/api/chatbots`, {method: "GET"})
      .then(_companies => {
        let result = _companies.reduce((acc, company) => {
          acc[company.company_id] = company
          return acc;
        }, {});
        setChatbotsByCompanyId(result)
      })
  }

  const reloadCompanies = companyId => {
    return fetchWithData(`${backendUrl}/api/companies`, {method: "GET"})
      .then(_companies => {
        let result = _companies.reduce((acc, company) => {
          acc[company.company_id] = company
          return acc;
        }, {});
        delete result['all']
        delete result['XXX']
        setCompaniesByCompanyId(result)
      })
  }

  const reloadLinks = companyId => {
    return fetchWithData(`${backendUrl}/api/links`, {method: "GET"})
      .then(_links => {
        let result = _links.reduce((acc, link) => {
          acc[link.id] = link
          return acc;
        }, {});
        setLinksById(result)
      })
  }

  const loadAllDataForAuthorizedUser = () => {
    if(user) {
      if(user.approval_status!=='approved') {
        fetchWithData(`${backendUrl}/api/users/approval_status`, {method: "GET"})
          .then(resp => {
            setUserApprovalStatus(resp.approval_status)
          })
      } else {
        setUserApprovalStatus(user.approval_status)
      }

      if(user.company_id) {
        setLoading(true)
        if(window.location.pathname === '/messages') {
          const urlParams = new URLSearchParams(window.location.search);
          const convo_id = urlParams.get('convo_id');
          const from_leads = urlParams.get('from_leads');
          if(convo_id) {
            setNavToMsgsFromLeadsTable(from_leads === 'true')
            fetchWithData(`${backendUrl}/api/messages?convo_id=${convo_id}`, {method: "GET"})
              .then(setMessagesForConvoId)
          }
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const epochSeconds30DaysAgo = Math.floor(thirtyDaysAgo.getTime() / 1000);
        const promises = [
          reloadCompanies(user.company_id),
          reloadChatbots(),
          reloadLinks(user.company_id),

          fetchWithData(`${backendUrl}/api/conversations?since_timestamp=${epochSeconds30DaysAgo}`, {method: "GET"})
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

          fetchWithData(`${backendUrl}/api/messages?latest=true&`, {method: "GET"})
            .then(latestMsgs => {
              const dayStartBuckets = getDayStartBuckets()
              const _countPerDayByCompanyId = transformDataForChart(latestMsgs, dayStartBuckets)
              setMsgCountPerDayByCompanyId(_countPerDayByCompanyId)
            }),

          fetchWithData(`${backendUrl}/api/messages/count_per_convo`, {method: "GET"})
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
  }

  const [pollLinks, setPollLinks] = useState(false);
  const pollLinksRef = useRef(pollLinks);
  const intervalRef = useRef();
  // Update the ref whenever pollLinks changes
  useEffect(() => {
    pollLinksRef.current = pollLinks;
  }, [pollLinks]);
  // Poll function using the ref
  const poll = () => {
    if(pollLinksRef.current) {
      reloadLinks(pollLinksRef.current)
    }
  };
  // Set up and clear the interval
  useEffect(() => {
    if (user && user.company_id) {
      intervalRef.current = window.setInterval(poll, 3500);
    }
    // Clear the interval when the component unmounts or condition changes
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    const userHasCompany = user && user.company_id
    if(!userHasCompany) {
      setOnboardingStep(onboardingSteps.createCompany)
    } else if(user.company_id === 'all') {
      setOnboardingStep(onboardingSteps.done)
    } else {
      const linksForSelectedCompany = Object.values(linksById).filter(link=>link.company_id === user.company_id)
      const company = companiesByCompanyId[user.company_id] || {}
      const chatbot = chatbotsByCompanyId[user.company_id] || {}
      const hasLinks = linksForSelectedCompany.length > 0
      const hasIncompleteLinks = linksForSelectedCompany.filter(link=>link.status==='').length > 0
      const isCompanyTraining = company.training

      if(!chatbot.initialized) {
        setOnboardingStep(onboardingSteps.customizeChatbot)
      } else if(!hasLinks || hasIncompleteLinks) {
        if(hasLinks && hasIncompleteLinks && isCompanyTraining) {
          setPollLinks(user.company_id)
        } else {
          setPollLinks(false)
        }
        setOnboardingStep(onboardingSteps.scrapeLinks)
      } else {
        setPollLinks(false)
        setOnboardingStep(onboardingSteps.done)
      }
    }
  },[user, linksById, companiesByCompanyId, chatbotsByCompanyId]);

  const clearAllDataForAuthorizedUser = () => {
    setCountPerDayByCompanyId({})
    setMsgCountPerDayByCompanyId({})
    setConversationsForBlackTie([])
    setConversationsForEdge([])
    setConversationsForSalesBot([])
  }

  const saveChatbotChanges = updatedChatbotValues => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/chatbots`, {
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

  const saveCompanyChanges = updatedCompanyValues => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/companies`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCompanyValues),
    })
      .then(data=> {
        if(data.status === 204) {
          setSaveResults('Company saved')
          setSaveResultsSeverity('success')
          reloadCompanies(updatedCompanyValues.company_id)
        } else {
          setSaveResults('There was an error saving the company information')
          setSaveResultsSeverity('error')
        }
        setShowSaveResults(true)
      })
      .finally(()=>setSaving(false))
  }

  const reloadLink = link => {
    return fetchWithData(`${backendUrl}/api/links/${link.id}`, {method: "GET"})
      .then(data=>data.json())
      .then(_link => {
        const _linksById = {...linksById}
        _linksById[_link.id] = _link
        setLinksById(_linksById)
      })
  }

  const saveLinkChanges = linkValues => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/links`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkValues),
    })
      .then(data=> {
        if(data.status === 204) {
          reloadLink(linkValues)
        } else {
          setSaveResults('There was an error saving the training link')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        }
      })
      .finally(()=>setSaving(false))
  }

  const addLink = (linkText,companyId) => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({link:linkText}),
    })
      .then(data=> {
        if(data.status === 204) {
          return reloadLinks(companyId)
            .then(()=>{
              setSaveResults('Training link added')
              setSaveResultsSeverity('success')
              setShowSaveResults(true)
            })
        } else {
          setSaveResults('There was an error saving the training link')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        }
      })
      .finally(()=>setSaving(false))
  }

  const startTraining = companyId => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/links/scrape`, {
      method: "POST"
    })
      .then(data=> {
        if(data.status === 204) {
          setSaveResults('Training started')
          setSaveResultsSeverity('success')
          setShowSaveResults(true)
          setPollLinks(companyId)
          return reloadCompanies(companyId)
        } else {
          setSaveResults('There was an error starting the training')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        }
      })
      .finally(()=>setSaving(false))
  }

  const createCompany = (newCompany) => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCompany),
    })
      .then(data=> {
        if(data.status === 200) {
          data.json()
            .then(newCompanyResponse=>{
              updateJwt(newCompanyResponse.company.company_id, newCompanyResponse.updated_jwt)
              window.location.reload()
            })
        } else if(data.status === 409) {
          console.error("Company already exists")
          setSaveResults('Sorry, this company already exists')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        } else {
          console.error("There was an error saving the chatbot")
          setSaveResults('There was an error saving the chatbot')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        }
      })
      .catch(()=>{
        setSaveResults('There was an error saving your company information')
        setSaveResultsSeverity('error')
        setShowSaveResults(true)
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
        saveCompanyChanges,
        showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity, saving,
        createCompany,
        linksById,
        saveLinkChanges,
        addLink,
        startTraining,
        onboardingSteps, onboardingStep, setOnboardingStep,
        userApprovalStatus,
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
