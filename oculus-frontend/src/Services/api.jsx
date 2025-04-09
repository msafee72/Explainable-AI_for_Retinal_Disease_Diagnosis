import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Existing request interceptor (unchanged)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Existing response interceptor (unchanged)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const res = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
                if (res.status === 200) {
                    localStorage.setItem('access_token', res.data.access);
                    localStorage.setItem('refresh_token', res.data.refresh);
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Existing authService (unchanged)
const authService = {
    signup: async (userData) => {
        let data = userData;
        let config = {};
        if (userData.profile_picture instanceof File) {
            data = new FormData();
            Object.keys(userData).forEach((key) => data.append(key, userData[key]));
            config = { headers: { 'Content-Type': 'multipart/form-data' } };
        }
        const response = await api.post('/doctors/signup/', data, config);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/token/', credentials);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    updateProfile: async (profileData) => {
        try {
            let data = profileData;
            let config = {};

            if (profileData instanceof FormData) {
                config = { headers: { 'Content-Type': 'multipart/form-data' } };
            } else {
                data = { ...profileData };
            }

            const response = await api.patch('/doctors/update_profile/', data, config);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },
    getMe: async () => {
        const response = await api.get('/doctors/me/');
        return response.data;
    },
};
// New OCT Image service
const octImageService = {
    uploadImage: async (imageFile, customId) => {
        try {
            const formData = new FormData();
            formData.append('image_file', imageFile);
            if (customId) formData.append('custom_id', customId);
            
            const response = await api.post('/oct-images/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            return {
                success: false,
                error: error.response?.data || 'Upload failed. Please try again.'
            };
        }
    },
    
    getImages: async () => {
        try {
            const response = await api.get('/oct-images/');
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    },
    
    getImageById: async (id) => {
        try {
            const response = await api.get(`/oct-images/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching image with ID ${id}:`, error);
            throw error;
        }
    },
};

// Analysis Result service
const analysisResultService = {
    getAnalysisResults: async () => {
        try {
            const response = await api.get('/analysis-results/');
            return response.data;
        } catch (error) {
            console.error('Error fetching analysis results:', error);
            throw error;
        }
    },
    
    getAnalysisForImage: async (imageId) => {
        try {
            const response = await api.get(`/analysis-results/?oct_image=${imageId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching analysis for image ID ${imageId}:`, error);
            return [];  // Return empty array on error to prevent UI crashes
        }
    }
};



// New Review service
const reviewService = {
    submitReview: async (reviewData) => {
        const response = await api.post('/reviews/', reviewData);
        return response.data;
    },

    getReviews: async (analysisId = null) => {
        const url = analysisId ? `/reviews/?analysis_result=${analysisId}` : '/reviews/';
        const response = await api.get(url);
        return response.data;
    },

    getReviewsForAnalysis: async (analysisId) => {
        const response = await api.get(`/reviews/?analysis_result=${analysisId}`);
        return response.data;
    },

    updateReview: async (reviewId, reviewData) => {
        const response = await api.patch(`/reviews/${reviewId}/`, reviewData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        await api.delete(`/reviews/${reviewId}/`);
    },

};

export { api, authService, octImageService, analysisResultService, reviewService, };