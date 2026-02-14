import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Authentication services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  register: async (userData) => {
    try {
      console.log('Sending registration data:', userData);
      const response = await api.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Registration response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw error.response.data;
      } else if (error.request) {
        console.error('No response received');
        throw { message: 'Server not responding. Please try again later.' };
      } else {
        throw { message: error.message || 'Network error' };
      }
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// User service
export const userService = {
  getCurrentUserDetails: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

// Medical Records service
export const medicalRecordService = {
  getRecords: async () => {
    try {
      const response = await api.get('/medical-records');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  addRecord: async (recordData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', recordData.title);
      formData.append('doctorName', recordData.doctorName);
      formData.append('recordType', recordData.recordType);
      if (recordData.description) {
        formData.append('description', recordData.description);
      }
      formData.append('file', recordData.file);
      
      const response = await axios.post(`${API_URL}/medical-records`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  downloadRecord: async (id) => {
    try {
      const response = await api.get(`/medical-records/${id}/file`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

// Prescription service
export const prescriptionService = {
  getPatientPrescriptions: async () => {
    try {
      const response = await api.get('/prescriptions/patient');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  getDoctorPrescriptions: async () => {
    try {
      const response = await api.get('/prescriptions/doctor');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  addPrescription: async (prescriptionData) => {
    try {
      const response = await api.post('/prescriptions', prescriptionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

// Appointment service
export const appointmentService = {
  getPatientAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  getPatientUpcomingAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient/upcoming');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  getDoctorAppointments: async () => {
    try {
      const response = await api.get('/appointments/doctor');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  getDoctorUpcomingAppointments: async () => {
    try {
      const response = await api.get('/appointments/doctor/upcoming');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  getAllDoctors: async () => {
    try {
      const response = await api.get('/appointments/doctors');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  scheduleAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments/schedule', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },
  
  updateAppointmentStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/appointments/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  deleteAppointment: async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  getAllPatientsForDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/appointments/patients?doctorId=${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

// Chat service
export const chatService = {
  sendMessage: async (senderId, receiverId, message) => {
    try {
      const response = await api.post('/chat/send', {
        senderId,
        receiverId,
        message
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  getChatHistory: async (userId1, userId2) => {
    try {
      const response = await api.get(`/chat/history/${userId1}/${userId2}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  getChatPartners: async (userId) => {
    try {
      const response = await api.get(`/chat/partners/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  markMessagesAsRead: async (senderId, receiverId) => {
    try {
      await api.post(`/chat/read/${senderId}/${receiverId}`);
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  getUnreadMessageCount: async (userId) => {
    try {
      const response = await api.get(`/chat/unread/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  }
};

export default api; 