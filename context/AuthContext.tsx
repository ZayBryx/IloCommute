import {
  createContext,
  FC,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { GUEST_TOKEN, API_URL, USER_TOKEN } from "@env";

interface JWTpayload {
  exp: number;
  name: string;
  role: string;
  userId: string;
}

interface AuthData {
  isAuth: boolean;
  user?: {
    name?: string;
    profilePicture?: string;
    id?: string;
  };
}

interface Error {
  error?: boolean;
  message?: string;
}

interface AuthContextType {
  authData: AuthData;
  guestLogin: (
    name: string
  ) => Promise<{ error?: boolean; code?: any; message?: any } | void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({
    isAuth: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // validates if user is logged in or not
  const checkAuth = async () => {
    const guest_token = await SecureStore.getItemAsync(GUEST_TOKEN);

    const currentDate = new Date();

    if (guest_token) {
      const decoded = jwtDecode<JWTpayload>(guest_token);

      if (decoded.exp * 1000 < currentDate.getTime()) {
        setAuthData({ isAuth: false, user: undefined });
        await SecureStore.deleteItemAsync(GUEST_TOKEN);
        axios.defaults.headers.common.Authorization = "";
        return;
      }

      setAuthData({
        isAuth: true,
        user: { name: decoded.name, id: decoded.userId },
      });

      axios.defaults.headers.common.Authorization = `Bearer ${guest_token}`;
      router.replace("/user");
    }
  };

  // guest login
  const guestLogin = async (name: string) => {
    setLoading(true);
    try {
      const guest = await axios.post("/auth/guest", { name: name });

      if (guest?.data?.error) {
        setError({ error: true, message: error?.message });
        setLoading(false);
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${guest?.data?.token}`;
      await SecureStore.setItemAsync(GUEST_TOKEN, guest?.data?.token);
      setAuthData({
        isAuth: true,
        user: { name: guest.data?.name, id: guest.data.userId },
      });
    } catch (error: any) {
      return {
        error: true,
        code: error?.response?.data?.code,
        message: error?.response?.data?.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // logout for guest and user
  const logout = async () => {
    setLoading(true);
    try {
      const userToken = await SecureStore.getItemAsync(USER_TOKEN);
      const guestToken = await SecureStore.getItemAsync(GUEST_TOKEN);

      if (guestToken) {
        await SecureStore.deleteItemAsync(GUEST_TOKEN);
      }

      setAuthData({
        isAuth: false,
        user: undefined,
      });

      await axios.delete("/auth/sign-out");
      axios.defaults.headers.common.Authorization = "";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ guestLogin, authData, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
