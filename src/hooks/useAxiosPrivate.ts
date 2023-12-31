import { useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { axiosPrivate } from '../api/axios';
import { useAuth } from './useAuth';
import { useAlert } from './useAlert';
import { v4 as uuid } from 'uuid';

const useAxiosPrivate = (): AxiosInstance => {
  const { auth } = useAuth();
  const { actions } = useAlert();

  useEffect(() => {
    const requestInterceptorId: number = axiosPrivate.interceptors.request.use(
      (req) => {
        if (!req.headers['Authorization']) {
          req.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }

        return req;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptorId: number =
      axiosPrivate.interceptors.response.use(
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
      axiosPrivate.interceptors.request.eject(requestInterceptorId);
      axiosPrivate.interceptors.response.eject(responseInterceptorId);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
