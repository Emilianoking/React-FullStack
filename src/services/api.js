import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post("/products", productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const createUser = (userData) => api.post("/auth/register", userData);
export const getUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export default api;