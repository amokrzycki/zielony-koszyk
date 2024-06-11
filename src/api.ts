import axios from "axios";
import User from "./types/User.ts";

const API_URL = "http://localhost:3000";
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const createUser = async (user: Partial<User>) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>) => {
  const response = await axios.put(`${API_URL}/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};
