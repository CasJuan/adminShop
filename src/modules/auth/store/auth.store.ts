import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, User } from '../interfaces';
import { loginAction } from '../actions/login.action';
import { useLocalStorage } from '@vueuse/core';
import { registerAction } from '../actions';
import { validateLocaleAndSetLanguage } from 'typescript';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Cheking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        logout();
        return false;
      }

      user.value = loginResp.user;
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;
      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const registerResp = await registerAction(fullName, email, password);

      if (!registerResp.ok) {
        logout();
        return { ok: false, message: registerResp.message };
      }

      user.value = registerResp.user;
      token.value = registerResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return { ok: true, message: '' };
    } catch (error) {
      console.log(error);
      return { ok: false, message: 'Error' };
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  return {
    user,
    token,
    authStatus,
    //Getters
    isCheking: computed(() => authStatus.value === AuthStatus.Cheking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //TODO: getter para saber si es Admin o no

    username: computed(() => user.value?.fullName),

    //Actions
    login,
    register,
  };
});
