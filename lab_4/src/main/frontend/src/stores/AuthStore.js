import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: './api'
})

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: null,
        refreshToken: null,
    }),

    actions: {
        setTokens({ accessToken, refreshToken, user }) {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.user = user
        },

        async register(userData) {
            try {
                const response = await api.post('/auth/registration', userData);
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        async login(credentials) {
            try {
                const response = await api.post('/auth/login', credentials)

                this.setTokens({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    user: credentials.username
                })

                return response.data
            } catch (error) {
                throw error
            }
        },

        logout() {
            this.user = null
            this.accessToken = null
            this.refreshToken = null
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
    },

    persist: true
})