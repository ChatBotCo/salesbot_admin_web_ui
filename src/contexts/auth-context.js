import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  UPDATE_USER: 'UPDATE_USER',
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  [HANDLERS.UPDATE_USER]: (state, action) => {
    const user = action.payload;
    try {
      const _authorizeUserdata = window.localStorage.getItem('authorizeUserdata');
      let authorizeUserdata = _authorizeUserdata ? JSON.parse(_authorizeUserdata) : {};
      authorizeUserdata = {
        ...authorizeUserdata,
        ...user,
      };
      window.localStorage.setItem('authorizeUserdata', JSON.stringify(authorizeUserdata));
    } catch (err) {
      console.error(err);
    }
    return {
      ...state,
      user
    };
  },
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const [backendUrl, setAuthBackendUrl] = useState("")
  const [waitingForLogin, setWaitingForLogin] = useState(false)

  const [showAuthResults, setShowAuthResults] = useState(false)
  const [authResults, setAuthResults] = useState('')
  const [authResultsSeverity, setAuthResultsSeverity] = useState('success')

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    let authorizeUserdata = null

    try {
      isAuthenticated = window.localStorage.getItem('authenticated') === 'true';
      const _authorizeUserdata = window.localStorage.getItem('authorizeUserdata');
      authorizeUserdata = _authorizeUserdata && JSON.parse(_authorizeUserdata)
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated && authorizeUserdata) {
      const user = {
        ... authorizeUserdata,
        avatar: '/assets/greeter-bot-logo.png',
        name: authorizeUserdata.user_name,
        email: authorizeUserdata.user_name,
        company_id: authorizeUserdata.company_id === 'XXX' ? null : authorizeUserdata.company_id,
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      if(window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
        signOut()
        window.location.replace('/auth/login')
      }
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (user_name, password) => {
    const body = { user_name, password }
    setWaitingForLogin(true)
    fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(data=>data.json())
      .then(authorizeUserdata => {
        if(authorizeUserdata.status === 401){
          window.alert("Invalid login credentials")
        } else {
          try {
            window.localStorage.setItem('authenticated', 'true');
          } catch (err) {
            console.error(err);
          }

          const user = {
            ...authorizeUserdata,
            avatar: '/assets/greeter-bot-logo.png',
            name: authorizeUserdata.user_name,
            email: authorizeUserdata.user_name,
            company_id: authorizeUserdata.company_id === 'XXX' ? null : authorizeUserdata.company_id,
          };

          try {
            window.localStorage.setItem('authorizeUserdata', JSON.stringify(authorizeUserdata));
          } catch (err) {
            console.error(err);
          }

          dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user
          });
          router.push('/')
        }
      })
      .catch(err=>{
        window.alert("Login error")
      })
      .finally(()=>setWaitingForLogin(false))
  };

  const signUp = async (user_name, password) => {
    const body = { user_name, password }
    return fetch(`${backendUrl}/api/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(data=> {
        if(data.status === 400) {
          setAuthResults('That account already exists')
          setAuthResultsSeverity('error')
          setShowAuthResults(true)
          return false
        } else if(data.status !== 204) {
          setAuthResults('There was an error saving the training link')
          setAuthResultsSeverity('error')
          setShowAuthResults(true)
          return false
        } else {
          return true
        }
      })
  };

  const signOut = () => {
    window.localStorage.removeItem('authenticated')
    window.localStorage.removeItem('authorizeUserdata')
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const isAuthenticated = () => {
    return window.localStorage.getItem('authenticated') === 'true' &&
      window.localStorage.getItem('authorizeUserdata');
  }

  const handleDismissAuthResults  = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAuthResults(false);
  };

  const updateJwt  = (company_id, updatedJwt) => {
    const user = {
      ...state.user,
      jwt: updatedJwt,
      company_id: company_id,
    };

    dispatch({
      type: HANDLERS.UPDATE_USER,
      payload: user
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
        setAuthBackendUrl,
        waitingForLogin,
        showAuthResults, authResults, authResultsSeverity,handleDismissAuthResults,
        updateJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
