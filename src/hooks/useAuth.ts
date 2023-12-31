import { useContext } from 'react';
import { AuthContext, UseAuthContextType } from '../context/Auth';

export const useAuth = (): UseAuthContextType => useContext(AuthContext);
