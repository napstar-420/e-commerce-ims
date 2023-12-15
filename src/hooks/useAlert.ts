import { useContext } from 'react';
import { AlertContext, UseAlertContextType } from '../context/Alert';

export const useAlert = (): UseAlertContextType => useContext(AlertContext);