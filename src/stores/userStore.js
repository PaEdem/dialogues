//src/stores/userStore.js
import { defineStore } from 'pinia';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  googleProvider,
} from '../firebase.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    loading: true,
  }),
  getters: {
    isPro: (state) => {
      return true;
    },
    planLimits() {
      const limits = {
        Free: { dailyGenerations: 2, totalDialogs: 10 },
        PRO: { dailyGenerations: Infinity, totalDialogs: Infinity },
      };
      return this.isPro ? limits.PRO : limits.Free;
    },
    dailyGenerationsUsage: () => {
      const usageData = JSON.parse(localStorage.getItem('usage')) || { count: 0, date: new Date().toDateString() };
      const today = new Date().toDateString();

      return {
        count: usageData.date !== today ? 0 : usageData.count,
      };
    },
  },
  actions: {
    initUser() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.isLoggedIn = !!user;
          this.loading = false;
          resolve();
        });
      });
    },
    async loginWithEmail(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error('Ошибка входа:', error.code);
        throw error;
      }
    },
    async registerWithEmail(email, password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error('Ошибка регистрации:', error.code);
        throw error;
      }
    },
    async loginWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error('Ошибка входа через Google:', error.code);
        throw error;
      }
    },
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Ошибка выхода:', error.code);
        throw error;
      }
    },
    incrementDailyUsage() {
      const usage = JSON.parse(localStorage.getItem('usage')) || { count: 0, date: new Date().toDateString() };
      const today = new Date().toDateString();

      usage.count = usage.date !== today ? 1 : usage.count + 1;
      usage.date = today;

      localStorage.setItem('usage', JSON.stringify(usage));
    },
  },
});
