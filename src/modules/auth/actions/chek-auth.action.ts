import { isAxiosError } from 'axios';
import type { AuthResponse, User } from '../interfaces';
import { tesloApi } from '@/api/tesloApi';

interface CheckError {
  ok: false;
}

interface CheckSuccess {
  ok: true;
  user: User;
  token: string;
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localToke = localStorage.getItem('token');
    if (localToke && localToke.length < 10) {
      return { ok: false };
    }
    const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');

    return {
      ok: false,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
      };
    }
  }
};
