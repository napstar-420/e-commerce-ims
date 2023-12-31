import defaultAxios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import config from '../config';

const defaultConfig: AxiosRequestConfig = {
  baseURL: config.SERVER_URL,
  paramsSerializer: (params) => stringify(params, { arrayFormat: 'brackets' }),
};

const privateConfig: AxiosRequestConfig = {
  ...defaultConfig,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export const axios: AxiosInstance = defaultAxios.create(defaultConfig);
export const axiosPrivate: AxiosInstance = defaultAxios.create(privateConfig);
