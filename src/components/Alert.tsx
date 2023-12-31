import { CSSProperties, ReactElement, useContext, useEffect } from 'react';
import {
  Alert as MuiAlert,
  Theme,
  useTheme,
  Collapse,
  AlertTitle,
} from '@mui/material';
import { AlertContext } from '../context/Alert';
import { AlertType } from '../dto';
import { TransitionGroup } from 'react-transition-group';
import config from '../config';

export default function Alert(): ReactElement {
  const { state, actions } = useContext(AlertContext);
  const handleClose = (alert: AlertType): void => {
    actions.removeAlert(alert);
  };

  const theme: Theme = useTheme();
  const styles: CSSProperties = {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    zIndex: 2000,
  };

  return (
    <div style={styles}>
      <TransitionGroup>
        {state?.alerts.length > 0 &&
          state.alerts.map((alert, index) => (
            <Collapse key={alert.id + index}>
              <SnackbarProvider alert={alert} handleClose={handleClose} />
            </Collapse>
          ))}
      </TransitionGroup>
    </div>
  );
}

interface SnackbarProviderProps {
  alert: AlertType;
  handleClose: (payload: AlertType) => void;
}

function SnackbarProvider({
  alert,
  handleClose,
}: SnackbarProviderProps): ReactElement {
  const duration: number = config.ALERT_TIMEOUT;
  const theme: Theme = useTheme();
  const styles: CSSProperties = {
    marginBottom: theme.spacing(2),
  };

  useEffect(() => {
    const timer: number = setTimeout(() => handleClose(alert), duration);

    return () => {
      clearTimeout(timer);
    };
  }, [alert, duration, handleClose]);

  return (
    <MuiAlert
      style={styles}
      onClose={() => handleClose(alert)}
      id={alert.id}
      elevation={6}
      variant="filled"
      severity={alert.type}
    >
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.text}
    </MuiAlert>
  );
}
