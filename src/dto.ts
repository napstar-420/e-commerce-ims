import { ReactElement } from 'react';
import { AlertColor } from '@mui/material';

export const enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ChildrenType = ReactElement | undefined;

export interface AlertType {
  text: string;
  type: AlertColor;
  id: string;
}

export const enum ALERT_ACTION_TYPE {
  ADD_ALERT,
  REMOVE_ALERT,
}

export interface ApiResponse {
  httpStatus: {
      code: any,
      text: any,
  },
  metadata: Omit<any, 'data'>,
  data: any,
  status?: string,
  statusText?: string
}

export interface LoginPayload {
  email: string,
  password: string,
}