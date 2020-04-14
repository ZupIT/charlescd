import defaultsDeep from 'lodash/defaultsDeep';
import isString from 'lodash/isString';
import { getAccessToken } from 'core/utils/auth';
import { getApplicationId } from 'core/utils/workspace';
import { getCircleId } from 'core/utils/circle';

export const buildHeaders = () => ({
  Accept: 'application/json',
  Authorization: `Bearer ${getAccessToken()}`,
  'Content-Type': 'application/json',
  'x-application-id': getApplicationId(),
  'x-circle-id': getCircleId()
});

export interface EnvVariables {
  REACT_APP_API_URI: string;
}

declare global {
  interface Window {
    ENVIRONMENT: EnvVariables;
  }
}

export const basePath = window.ENVIRONMENT?.REACT_APP_API_URI || '/api';

export const baseRequest = (
  url: string,
  body: object | string | undefined = undefined,
  options?: RequestInit
): ((options: RequestInit) => Promise<Response>) => {
  const defaultOptions = {
    headers: buildHeaders(),
    body: isString(body) ? body : JSON.stringify(body)
  };
  const mergedOptions = defaultsDeep(options, defaultOptions);

  return (options?: RequestInit) =>
    fetch(`${basePath}${url}`, defaultsDeep(mergedOptions, options)).then(
      (response: Response) => {
        if (!response.ok) {
          return Promise.reject(response);
        } else {
          return response;
        }
      }
    );
};
