export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "https://api.loadboard.asia/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }
    return response.json();
  };

  return {
    // Auth endpoints
    auth: {
      register: async (data: any) => {
        const response = await fetch(`${apiBase}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      login: async (data: any) => {
        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      profile: async () => {
        const response = await fetch(`${apiBase}/auth/profile`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
    },

    // Loads endpoints
    loads: {
      getAll: async (params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(
          `${apiBase}/loads${query ? `?${query}` : ""}`,
          {
            headers: getAuthHeaders(),
          },
        );
        return handleResponse(response);
      },
      getOne: async (id: string) => {
        const response = await fetch(`${apiBase}/loads/${id}`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
      create: async (data: any) => {
        const response = await fetch(`${apiBase}/loads`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      update: async (id: string, data: any) => {
        const response = await fetch(`${apiBase}/loads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      delete: async (id: string) => {
        const response = await fetch(`${apiBase}/loads/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
    },

    // Applications endpoints
    applications: {
      create: async (data: any) => {
        const response = await fetch(`${apiBase}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      getMy: async () => {
        const response = await fetch(`${apiBase}/applications/my`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
      updateStatus: async (id: string, status: string) => {
        const response = await fetch(`${apiBase}/applications/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status }),
        });
        return handleResponse(response);
      },
    },

    // Deals endpoints
    deals: {
      create: async (data: any) => {
        const response = await fetch(`${apiBase}/deals`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      getMy: async () => {
        const response = await fetch(`${apiBase}/deals/my`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
      updateStatus: async (id: string, status: string) => {
        const response = await fetch(`${apiBase}/deals/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ status }),
        });
        return handleResponse(response);
      },
    },

    // Messages endpoints
    messages: {
      getConversation: async (userId: string) => {
        const response = await fetch(
          `${apiBase}/messages/conversation/${userId}`,
          {
            headers: getAuthHeaders(),
          },
        );
        return handleResponse(response);
      },
      send: async (data: any) => {
        const response = await fetch(`${apiBase}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
    },

    // Reviews endpoints
    reviews: {
      create: async (data: any) => {
        const response = await fetch(`${apiBase}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
      getForUser: async (userId: string) => {
        const response = await fetch(`${apiBase}/reviews/user/${userId}`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
    },

    // Users endpoints
    users: {
      getProfile: async () => {
        const response = await fetch(`${apiBase}/users/profile`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
      update: async (data: any) => {
        const response = await fetch(`${apiBase}/users/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        return handleResponse(response);
      },
    },

    // Journeys endpoints
    journeys: {
      getActiveWithLoads: async () => {
        const response = await fetch(`${apiBase}/journeys/tracking/active`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(response);
      },
      getLocations: async (journeyId: string) => {
        const response = await fetch(
          `${apiBase}/journeys/${journeyId}/locations`,
          {
            headers: getAuthHeaders(),
          },
        );
        return handleResponse(response);
      },
    },
  };
};
