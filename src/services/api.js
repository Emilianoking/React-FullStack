import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL de tu backend local
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar interceptor para manejar el token JWT (si es necesario)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // O donde guardes tu token
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

export default api;