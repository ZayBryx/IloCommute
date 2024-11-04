import {
  createContext,
  FC,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { GUEST_TOKEN, API_URL } from "@env";

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
  guestLogin: (
    name: string
  ) => Promise<{ error?: boolean; code?: any; message?: any } | void>;
  authData: AuthData;
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

  return (
    <AuthContext.Provider value={{ guestLogin, authData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
