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
import {
  GUEST_TOKEN,
  API_URL,
  USER_TOKEN,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
} from "@env";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  JWTpayload,
  GoogleJWTpayload,
  User,
  Data,
  GoogleResponse,
  AuthData,
  Error,
  AuthContextType,
} from "@/types";

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
    try {
      setLoading(true);
      const guest_token = await SecureStore.getItemAsync(GUEST_TOKEN);
      const user_token = await SecureStore.getItemAsync(USER_TOKEN);

      const currentDate = new Date();

      if (user_token) {
        const decoded = jwtDecode<GoogleJWTpayload>(user_token);

        if (decoded.exp * 1000 < currentDate.getTime()) {
          setAuthData({ isAuth: false, user: undefined });
          await SecureStore.deleteItemAsync(USER_TOKEN);
          axios.defaults.headers.common.Authorization = "";
          return;
        }

        setAuthData({
          isAuth: true,
          user: {
            name: decoded.name,
            id: decoded.sub,
            profilePicture: decoded.picture,
          },
        });

        axios.defaults.headers.common.Authorization = `Bearer ${user_token}`;
        router.push("/user");
      }

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
        router.push("/user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // guest login
  const guestLogin = async (name: string) => {
    setLoading(true);
    try {
      const guest = await axios.post("/auth/guest", { name: name });

      axios.defaults.headers.common.Authorization = `Bearer ${guest?.data?.token}`;
      await SecureStore.setItemAsync(GUEST_TOKEN, guest?.data?.token);
      setAuthData({
        isAuth: true,
        user: { name: guest.data?.name, id: guest.data.userId },
      });
    } catch (error: any) {
      return {
        error: true,
        message: error?.response?.data?.error?.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response?.type !== "success") return;

      const api = await axios.post("/auth/google", {
        serverAuthCode: response.data.serverAuthCode,
      });

      if (api.status !== 200 || !api.data.token) {
        alert("Invalid Login");
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${api.data.token}`;
      await SecureStore.setItemAsync(USER_TOKEN, api.data.token);

      setAuthData({
        isAuth: true,
        user: {
          name: api.data.user.name,
          id: api.data.user.googleId,
          profilePicture: api.data.user.picture,
        },
      });

      // axios.defaults.headers.common.Authorization = `Bearer ${response.data.idToken}`;
      // await SecureStore.setItemAsync(USER_TOKEN, response.data.idToken || "");

      // setAuthData({
      //   isAuth: true,
      //   user: {
      //     name: response.data.user.name || undefined,
      //     id: response.data.user.id,
      //     profilePicture: response.data.user.photo || undefined,
      //   },
      // });

      router.replace("/user");
    } catch (error) {
      console.error("Google Sign In Error:", error);
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

      if (userToken) {
        await SecureStore.deleteItemAsync(USER_TOKEN);
        await GoogleSignin.signOut();
      }

      if (guestToken) {
        await SecureStore.deleteItemAsync(GUEST_TOKEN);
      }

      setAuthData({
        isAuth: false,
        user: undefined,
      });

      router.push("/login");
      await axios.delete("/auth/sign-out");
      axios.defaults.headers.common.Authorization = "";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const configureGoogleSignin = () => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ["profile", "email"],
    });
  };

  useEffect(() => {
    configureGoogleSignin();
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ guestLogin, googleSignIn, authData, logout, checkAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
