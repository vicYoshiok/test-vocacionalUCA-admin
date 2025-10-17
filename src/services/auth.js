export const loginUser = async (email, password) => {
  // Paso 1: solicitar cookie CSRF
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });

  // Paso 2: ahora sí, enviar login
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error de login");
  }

  return res.json();
};
