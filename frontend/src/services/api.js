import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const customerService = {
  getAllCustomers: () => api.get("/customers"),
  createCustomer: (data) => api.post("/customers", data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  markAsSent: (id) => api.patch(`/customers/${id}/mark-sent`),
  getStats: () => api.get("/customers/stats/overview"),
};

export const generateWhatsAppLink = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`;
};

export const generateSMSLink = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `sms:${phone.replace(/\D/g, "")}?body=${encodedMessage}`;
};

export const generateTrackingLink = (trackingId) => {
  return `${window.location.origin}/r/${trackingId}`;
};

export default api;
