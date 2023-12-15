import nAxios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { stringify } from 'qs';
import { ApiResponse, LoginPayload } from '../dto';
import { omit, cloneDeep } from 'lodash';
import config from '../config';

export default {
  login,
  get: $get,
  post: $post,
  update: $update,
  delete: $delete,
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: config.SERVER_URL,
  paramsSerializer: {
    serialize: (params) => stringify(params, { arrayFormat: 'brackets' }),
  },
};

const axios: AxiosInstance = nAxios.create(axiosConfig);

async function $submit(
  method: 'get' | 'post' | 'update' | 'delete',
  endpoint: string,
  payload?: object
): Promise<ApiResponse> {
  try {
    const response: AxiosResponse = await (axios as any)[method](
      endpoint,
      payload
    );

    return {
      httpStatus: {
        code: response.status,
        text: response.statusText,
      },
      metadata: omit(response.data, ['data']),
      data: cloneDeep(response.data.data),
    };
  } catch (error: any) {
    if (!error?.response || error.response.status >= 500) {
      throw {
        error: 'Server Error',
        message: 'Something went wrong',
      };
    }

    if (error.response?.status === 400 && error.response.data.errors) {
      throw {
        error: 'Bad request',
        message: error.response.data.errors[0].msg,
      };
    }

    if (error.response?.status === 401) {
      throw {
        error: 'Unauthorized',
        message: 'You are not authorized',
      };
    }

    throw {
      httpStatus: {
        code: error.code,
        text: error.message,
      },
      message: error.response.data || error.message,
      error: error.response.statusText || error.code,
    };
  }
}

function $get(endpoint: string, payload?: object): Promise<ApiResponse> {
  return $submit('get', endpoint, payload);
}

function $post(endpoint: string, payload?: object): Promise<ApiResponse> {
  return $submit('post', endpoint, payload);
}

function $update(endpoint: string, payload?: object): Promise<ApiResponse> {
  return $submit('update', endpoint, payload);
}

function $delete(endpoint: string, payload?: object): Promise<ApiResponse> {
  return $submit('delete', endpoint, payload);
}

function login(payload: LoginPayload): Promise<ApiResponse> {
  return $post(config.API.LOGIN_URL, payload);
}
