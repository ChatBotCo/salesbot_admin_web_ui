import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./use-auth";
import {useApi} from "./use-api";

const RootAdminContext = createContext();

export const RootAdminProvider = ({ children }) => {
  const {
    user,
  } = useAuth()

  const {
    backendUrl,
    fetchWithData, fetchNoData,
    setSaveResults, setSaveResultsSeverity, setShowSaveResults, setSaving,
  } = useApi()


  const [allUsers, setAllUsers] = useState([])

  const reloadAllUsers = ()=> {
    return fetchWithData(`${backendUrl}/api/users`, {method: "GET"})
      .then(resp => {
        setAllUsers(resp)
      })
  }

  const loadAllDataForRootAdminUser = () => {
    if(user) {
      if(user.role==='root') {
        reloadAllUsers()
      }
    }
  }

  const clearAllDataForRootAdminUser = () => {
    setAllUsers([])
  }

  // On User object update (auth change)
  useEffect(() => {
    clearAllDataForRootAdminUser()
    loadAllDataForRootAdminUser()
  },[user]);

  const updateUserApproval = (user, approval_status) => {
    setSaving(true)
    fetchNoData(`${backendUrl}/api/users/approval_status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user, approval_status}),
    })
      .then(data=> {
        if(data.status === 204) {
          return reloadAllUsers()
            .then(()=>{
              setSaveResults('User status updated')
              setSaveResultsSeverity('success')
              setShowSaveResults(true)
            })
        } else {
          setSaveResults('There was an error saving the user status')
          setSaveResultsSeverity('error')
          setShowSaveResults(true)
        }
      })
      .finally(()=>setSaving(false))
  }

  return (
    <RootAdminContext.Provider
      value={{
        allUsers,
        updateUserApproval,
      }}
    >
      {children}
    </RootAdminContext.Provider>
  );
};

export const useRootAdmin = () => {
  const context = useContext(RootAdminContext);
  if (!context) {
    throw new Error("use-root-admin must be used within a RootAdminContext");
  }
  return context;
};
