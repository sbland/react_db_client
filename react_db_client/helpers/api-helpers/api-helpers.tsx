/*  ASYNC Calls to the API on Node server
 *
 */
import React from 'react';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { ISearchParams } from './lib';

export interface IApiResponse<ResponseData = never> {
  ok: boolean;
  data?: ResponseData;
}

export interface IApiGetResponse<ResponseData> {
  ok: boolean;
  data?: ResponseData;
  error?: string;
}

export interface ApiReturnType<Data, ResponseData> {
  request: {
    url: string;
    options: RequestInit;
    data?: Data;
  };
  response: ResponseData;
}

function ApiError(message = '') {
  this.name = 'ApiError';
  this.message = message;
}
ApiError.prototype = Error.prototype;

// const DEV_MODE = process.env.NODE_ENV === "development";

/* API HELPERS */

const manageResponse =
  <ResponseData,>(url) =>
  async (response: Response) => {
    if (response.ok) {
      return response.json() as Promise<ResponseData>;
    }

    const apiError = await response.json().then((r) => r.error);
    const errorMessage = apiError || `Something went wrong getting data from ${url}`;
    const error = new ApiError(errorMessage);
    console.error(`Something went wrong getting data from ${url}`);
    throw error;
  };
/**
 * Get Data from api
 *
 * @param {string} url
 * @returns
 */
export const getDataFetch = async <ResponseData,>(
  url: string,
  filters?: FilterObjectClass[],
  additionalParameters?: string[]
): Promise<ApiReturnType<null, ResponseData>> => {
  const filterString = filters && queryDetailedObjectToString(filters);
  const queryString = [additionalParameters, filterString].filter((f) => f != null).join('&');
  const queryStringOr = queryString.length ? `?${queryString}` : '';

  const fullUrl = encodeURI(`${url}${queryStringOr}`);

  const options: RequestInit = {
    method: 'GET',
    cache: 'no-store' /* TODO: Enable cache */,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const responseData = await fetch(fullUrl, options).then(manageResponse<ResponseData>(url));

  return { response: responseData, request: { url, options } };
};

/**
 * Update a doc via the api
 *
 * @param {string} url
 * @param {object} data
 * @returns
 */
export const putDataFetch = async <Data, ResponseData>(
  url: string,
  data: Data
): Promise<ApiReturnType<Data, ResponseData>> => {
  const options: RequestInit = {
    method: 'PUT',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ data }),
  };

  const responseData = await fetch(url, options).then(manageResponse<ResponseData>(url));

  return { response: responseData, request: { url, options, data } };
};

/**
 * Upload a new doc to the api
 *
 * @param {string} url
 * @param {object} data
 * @returns
 */
export const postDataFetch = async <Data, ResponseData>(
  url: string,
  data: Data
): Promise<ApiReturnType<Data, ResponseData>> => {
  const options: RequestInit = {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ data }),
  };

  const responseData = await fetch(url, options).then(async (response) => {
    if (response.ok) {
      return response.json();
    }
    const apiError = await response
      .json()
      .then((r) => r)
      .catch((e) => e);
    const errorMessage =
      apiError.error || response.statusText || `Something went wrong getting data from ${url}`;
    const error = new ApiError(errorMessage);
    throw error;
  });

  return { response: responseData, request: { url, options, data } };
};

/**
 * Get Data from api
 *
 * @param {string} url
 * @returns
 */
export const deleteDataFetch = async <Data, ResponseData>(
  url: string,
  data: Data
): Promise<ApiReturnType<Data, ResponseData>> => {
  const options: RequestInit = {
    method: 'DELETE',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  };

  const responseData = await fetch(url, options).then(manageResponse<ResponseData>(url));

  return { response: responseData, request: { url, options, data } };
};

/* queryObjectToString
 * Converts an array of filters into a query string
 * I.e. [{ uid: 'a', value: 'foo'}, { uid: 'b', value: 'bar' }] => '?a=foo&b=bar'
 */
export const queryDetailedObjectToString = (filters: FilterObjectClass[]): string =>
  filters.length > 0 ? `filters=${JSON.stringify(Object.values(filters))}` : '';

// Legacy method requires openapi3 but MSW does not support it
// /* queryObjectToString
//  * Converts an array of filters into a query string
//  * I.e. [{ uid: 'a', value: 'foo'}, { uid: 'b', value: 'bar' }] => '?a=foo&b=bar'
//  */
// export const queryDetailedObjectToString = (
//   filters: FilterObjectClass[]
// ): string => {
//   const queryArray = filters.map((queryItem) => {
//     const { uid, field, value, operator, type } = queryItem;
//     // Encode for api
//     const f = field || uid;
//     let str = `${f}[field]=${f}`;
//     // if value is array we add multiple
//     if (Array.isArray(value)) {
//       value.forEach((v) => {
//         str += `&${f}[value]=${v}`;
//       });
//     } else {
//       str += `&${f}[value]=${value}`;
//     }
//     str += `&${f}[type]=${type || "string"}`;
//     if (operator) str += `&${f}[operator]=${operator}`;
//     return str;
//   });
//   return queryArray.length > 0 ? `${queryArray.join("&")}` : "";
// };

/* queryObjectToString
 * Converts a object to a query string
 * I.e. { a: 'foo', b: 'bar } => '?a=foo&b=bar'
 */
export const queryObjectToString = (queryObject) => {
  const queryArray: string[] = [];
  Object.keys(queryObject).forEach((key) => {
    queryArray.push(`${key}=${queryObject[key]}`);
  });
  if (queryArray.length > 0) return `${queryArray.join('&')}`;
  return '';
};

/**
 * Converts schema request array into a string
 *
 * @param {Array} schemaRequest
 * @returns
 */
export const schemaRequestArrayToQueryString = (schemaRequest) => {
  if (Array.isArray(schemaRequest)) return schemaRequest.join(',');
  if (typeof schemaRequest === 'string') return schemaRequest;
  throw Error('Schema Request is not an array or string!');
};

export const searchParamsToFilters = (searchParams: ISearchParams): FilterObjectClass[] => {
  return [];
};
