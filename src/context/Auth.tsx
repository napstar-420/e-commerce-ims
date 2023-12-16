import { ReactElement, createContext, useCallback, useReducer } from "react";
import { ChildrenType, User } from "../dto";

interface StateType {
    user: User | null,
    accessToken: string | null, 
}

interface Payload {
    user: User,
    accessToken: string,
}

const enum USER_ACTION_TYPE {
    UPDATE,
    DELETE
}

interface ReducerAction {
    type: USER_ACTION_TYPE,
    payload?: {
        user: User,
        accessToken:  string
    },
}

const initState: StateType = {
    user: null,
    accessToken: null,
}

const reducer = (state: StateType, action: ReducerAction): StateType => {
    switch (action.type) {
        case USER_ACTION_TYPE.UPDATE:
            if (!action.payload?.user || !action.payload?.accessToken) {
                throw new Error('Payload can\'t be empty');
            }

            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken
            }
        
        case USER_ACTION_TYPE.DELETE:
            return { user: null, accessToken: null }

        default:
            console.log('Unknown type', action.type);
            return state;
    }
}

const useAuthContext = (initState: StateType) => {
    const [auth, dispatch] = useReducer(reducer, initState);

    const actions = {
        update: (payload: Payload): void => dispatch({ type: USER_ACTION_TYPE.UPDATE, payload }),
        remove: useCallback((): void => dispatch({ type: USER_ACTION_TYPE.DELETE }), [])
    }

    return { auth, actions };
}

export type UseAuthContextType = ReturnType<typeof useAuthContext>;

const initContextState: UseAuthContextType = {
    auth: initState,
    actions: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        update: (_payload: Payload) => {},
        remove: () => {}
    }
}

export const AuthContext = createContext<UseAuthContextType>(initContextState);

interface AuthProviderProps {
    children: ChildrenType,
}

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
    return (
        <AuthContext.Provider value={useAuthContext(initState)}>
            { children }
        </AuthContext.Provider>
    )
}
