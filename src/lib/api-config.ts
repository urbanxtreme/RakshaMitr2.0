
// API configuration for backend connectivity
// This will be used for connecting to our FastAPI backend

export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Contacts endpoints
  CONTACTS: `${API_BASE_URL}/contacts`,
  CONTACT: (id: string) => `${API_BASE_URL}/contacts/${id}`,
  
  // SOS endpoints
  SEND_SOS: `${API_BASE_URL}/sos/send`,
  SOS_HISTORY: `${API_BASE_URL}/sos/history`,
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 0,
      message: "No response received from server. Please check your connection.",
      data: null
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 0,
      message: error.message || "An unknown error occurred",
      data: null
    };
  }
};
