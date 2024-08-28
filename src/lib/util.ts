import axios from "axios";

export const appAxios = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const fetchData = (url: string) => appAxios(url).then((res) => res.data);
