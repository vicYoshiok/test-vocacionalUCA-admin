/*export const loginUser = async (email, password) => {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error de login");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
};*/


/*

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export const loginUser = async (email, password) => {
  await axios.get("/sanctum/csrf-cookie");
  const res = await axios.post("/api/login", { email, password });
  return res.data;
};*/


export const getCsrfCookie = async () => {
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });
};

export const loginUser = async (email, password) => {
  await getCsrfCookie(); // importante

  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ usar cookies
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error de login");
  }

  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch("http://localhost:8000/api/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};
