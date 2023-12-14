import { ReactElement, createContext, useCallback, useReducer } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@emotion/react';
import { ChildrenType, ThemeType } from '../dto';
import { createTheme } from '@mui/material';

const enum REDUCER_ACTION_TYPE {
  TOGGLE,
}

interface ReducerAction {
  type: REDUCER_ACTION_TYPE;
}

const initState: ThemeType = ThemeType.LIGHT;

const reducer = (state: ThemeType, action: ReducerAction): ThemeType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.TOGGLE:
      return state === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
    default:
      throw new Error();
  }
};

const useThemeContext = (initState: ThemeType) => {
    const [theme, dispatch] = useReducer(reducer, initState);
    const toggleTheme = useCallback(() => dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE }), []);

    return { theme, toggleTheme };
}

type UseThemeContextType = ReturnType<typeof useThemeContext>;

const initContextState: UseThemeContextType = {
    theme: initState,
    toggleTheme: () => {}
}

export const ThemeContext = createContext<UseThemeContextType>(initContextState);

interface ThemeProviderProps {
  children: ChildrenType,
  initTheme: ThemeType
}

export const ThemeProvider = ({ children, initTheme }:  ThemeProviderProps): ReactElement => {
  const { theme, toggleTheme } = useThemeContext(initTheme);
  const muiTheme = createTheme({
    palette: {
      mode: theme,
    }
  })

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        { children }
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}