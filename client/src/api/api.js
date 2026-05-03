const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, message: data.msg || "Something went wrong" };
  }

  return data;
};

// ─── Auth API ────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getUser: () => request("/auth/user"),
};

// ─── Projects API ────────────────────────────────────────
export const projectAPI = {
  create: (body) =>
    request("/projects", { method: "POST", body: JSON.stringify(body) }),

  getAll: () => request("/projects"),

  getById: (id) => request(`/projects/${id}`),

  remove: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  addMember: (id, body) =>
    request(`/projects/${id}/members`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  removeMember: (projectId, userId) =>
    request(`/projects/${projectId}/members/${userId}`, { method: "DELETE" }),
};

// ─── Tasks API ───────────────────────────────────────────
export const taskAPI = {
  create: (body) =>
    request("/tasks", { method: "POST", body: JSON.stringify(body) }),

  getMyTasks: () => request("/tasks/my-tasks"),

  getByProject: (projectId) => request(`/tasks/project/${projectId}`),

  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
