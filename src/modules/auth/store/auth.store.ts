import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, User } from '../interfaces';
import { loginAction } from '../actions/login.action';
import { templateRef, useLocalStorage } from '@vueuse/core';
import { checkAuthAction, registerAction } from '../actions';
import { validateLocaleAndSetLanguage } from 'typescript';

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

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      if (!statusResp) {
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      user.value = statusResp.user;
      token.value = statusResp.token;
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  return {
    user,
    token,
    authStatus,
    //Getters
    isCheking: computed(() => authStatus.value === AuthStatus.Cheking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    //TODO: getter para saber si es Admin o no

    idAdmin: computed(() => user.value?.roles.includes('admin') ?? false),
    username: computed(() => user.value?.fullName),

    //Actions
    login,
    register,
    logout,
  };
});
