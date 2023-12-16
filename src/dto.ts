import { ReactElement } from 'react';
import { AlertColor } from '@mui/material';

export const enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export const enum ALERT_ACTION_TYPE {
  ADD_ALERT,
  REMOVE_ALERT,
}

export const enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export type ChildrenType = ReactElement | undefined;

export interface User {
  email: string,
  full_name: string,
  role: UserRoles,
  user_id: number,
  username: string
}

export interface AlertType {
  text: string;
  type: AlertColor;
  id: string;
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