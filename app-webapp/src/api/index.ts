import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (res) => res,
      (err) => Promise.reject(err?.response?.data ?? err),
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<{ success: boolean; data: T }>(url, config);
    return res.data.data;
  }

  async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<{ success: boolean; data: T }>(url, body, config);
    return res.data.data;
  }

  async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<{ success: boolean; data: T }>(url, body, config);
    return res.data.data;
  }

  async del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<{ success: boolean; data: T }>(url, config);
    return res.data.data;
  }

  async postMultipart<T>(url: string, form: FormData, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<{ success: boolean; data: T }>(url, form, {
      ...config,
      headers: { ...config?.headers, "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL);
