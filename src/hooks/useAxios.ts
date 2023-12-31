import { useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { axios } from '../api/axios';
import { useAlert } from './useAlert';
import { v4 as uuid } from 'uuid';

const useAxios = (): AxiosInstance => {
  const { actions } = useAlert();

  useEffect(() => {
    const responseInterceptorId: number = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        let errorTitle: string = 'Error';
        let errorMMessage: string = 'Something went wrong';

        if (!error?.response || error.response.status >= 500) {
          errorTitle = 'Server Error';
        }

        if (error.response?.status === 400 && error.response.data.errors) {
          errorTitle = 'Bad request';
          errorMMessage = error.response.data.errors[0].msg as string;
        }

        if (error.response?.status === 401) {
          errorTitle = 'UnAuthorized';
          errorMMessage = 'You are not authorized';
        }

        if (error.response?.status === 403) {
          errorMMessage = 'Forbidden';
        }

        actions.addAlert({
          id: uuid(),
          title: errorTitle,
          text: errorMMessage,
          type: 'error',
        });

        // If the error does not match any specific case, handle it here
        throw {
          httpStatus: {
            code: error.code,
            text: error.message,
          },
          message: error.response.data || error.message,
          error: error.response.statusText || error.code,
        };
      }
    );

    return (): void => {
      axios.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return axios;
};

export default useAxios;
