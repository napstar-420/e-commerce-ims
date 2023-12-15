import { ReactElement, createContext, useReducer } from 'react';
import { ALERT_ACTION_TYPE, AlertType, ChildrenType } from '../dto';

interface StateType {
  alerts: AlertType[];
}

interface ReducerAction {
  type: ALERT_ACTION_TYPE;
  payload?: AlertType;
}

const initState: StateType = {
  alerts: [],
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case ALERT_ACTION_TYPE.ADD_ALERT:
      if (action.payload) {
        const newAlerts: AlertType[] = [...state.alerts, action.payload];
        return { ...state, alerts: newAlerts };
      }
      return state;

    case ALERT_ACTION_TYPE.REMOVE_ALERT:
      if (action.payload) {
        const alerts: AlertType[] = state.alerts.filter(
          (e) => e.id !== action.payload?.id
        );
        return { alerts };
      }
      return state;

    default:
      console.log('No valid action: ' + action.type);
      return state;
  }
};

const useAlertContext = (initState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const actions = {
    addAlert: (payload: AlertType) => {
      dispatch({ type: ALERT_ACTION_TYPE.ADD_ALERT, payload });
    },
    removeAlert: (payload: AlertType) => {
      dispatch({ type: ALERT_ACTION_TYPE.REMOVE_ALERT, payload });
    },
  };

  return { state, actions };
};

export type UseAlertContextType = ReturnType<typeof useAlertContext>;

const initContextState: UseAlertContextType = {
  state: initState,
  actions: {
    addAlert: () => {},
    removeAlert: () => {},
  },
};

export const AlertContext = createContext<UseAlertContextType>(initContextState);

interface AlertProviderProps {
  children: ChildrenType
}

export const AlertProvider = ({ children }: AlertProviderProps): ReactElement => {
  return (
    <AlertContext.Provider value={useAlertContext(initState)}>
      { children }
    </AlertContext.Provider>
  )
}