import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const fetchData = (url: string) =>
  axiosInstance(url).then((res) => res.data);

export const apiService = {
  createData: async <T>(url: string, data: T): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  getData: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  },

  editData: async <T>(url: string, data: T): Promise<T> => {
    const response = await axios.put<T>(url, data);
    return response.data;
  },
};
