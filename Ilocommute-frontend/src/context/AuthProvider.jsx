import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

// axios.defaults.baseURL = "https://ilocommute-api.onrender.com/api/v1";
axios.defaults.baseURL = "http://localhost:2024/api/v1";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    role: null,
    isAuth: false,
    user: {
      name: null,
      email: null,
      googleId: null,
      _id: null,
      photo: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/auth/refresh");

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response?.data?.id_token}`;

      console.log(response.data.id_token);

      const credential = await axios.get("/auth/credential");

      const { role, _id, googleId, email, picture, name } = credential.data;

      setAuthData({
        isAuth: true,
        role,
        user: {
          _id,
          googleId,
          email,
          name,
          photo: picture,
        },
      });

      navigate("/");
    } catch (error) {
      // console.error("ERROR: ", error);
      // setError("Failed to check user authentication. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const isUserAuth = authData.isAuth;

    if (!isUserAuth && window.location.pathname === "/") {
      checkUser();
    } else if (isUserAuth && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [checkUser, authData.isAuth, navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (googleResponse) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/auth/google/admin", {
          code: googleResponse.code,
        });

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.tokens.id_token}`;

        setAuthData({
          role: response.data.user.role,
          isAuth: true,
          user: {
            name: response.data.user.name,
            email: response.data.user.email,
            googleId: response.data.user.googleId,
            _id: response.data.user._id,
            photo: response.data.user.picture,
          },
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Login Error: ", error);
        setError("Login failed. Please check your credentials and try again.");
      } finally {
        setLoading(false);
      }
    },
    flow: "auth-code",
  });

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete("/auth/admin/logout");

      setAuthData({
        role: null,
        isAuth: false,
        user: {
          name: null,
          _id: null,
          photo: null,
        },
      });

      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    } catch (error) {
      console.error("Logout Error: ", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authData, signOut, googleLogin, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProviderWithGoogle = ({ children, clientId }) => (
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>{children}</AuthProvider>
  </GoogleOAuthProvider>
);
