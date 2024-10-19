import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

async function apiRequest<T>(
  url: string,
  method: "get" | "post" | "put",
  data = {},
  params = {},
  headers = {}
): Promise<T> {
  const config: AxiosRequestConfig = {
    url,
    method,
    data,
    params,
    headers,
  };
  const response = await axiosInstance.request<T>(config);
  return response.data;
}

export const apiService = {
  createData: async <T>(url: string, data: Partial<T>): Promise<T> => {
    return apiRequest<T>(url, "post", data);
  },

  getData: async <T>(url: string, params?: object): Promise<T> => {
    return apiRequest<T>(url, "get", {}, params);
  },
  editData: async <T>(url: string, data: Partial<T>): Promise<T> => {
    return apiRequest<T>(url, "put", data);
  },
};
