import { Loader } from "@/components/ui/loader";
import { axiosClient, clearAuthTokens, setAuthTokens } from "@/shared/lib/axiosClient";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type UserRole = "student" | "admin";

export interface UserProfile {
  educationLevel?: string;
  major?: string;
  gpa?: number;
  preferredCountries?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile?: UserProfile;
  bookmarks?: string[];
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const USER_STORAGE_KEY = "applybro_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
// Default to backend auth (can be disabled with VITE_ENABLE_BACKEND=false)
const ENABLE_BACKEND_AUTH = import.meta.env.VITE_ENABLE_BACKEND !== "false";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = (nextUser: User | null) => {
    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const buildMockUser = useCallback(
    (email: string): User => ({
      id: "demo-user",
      name: email.split("@")[0] || "Student",
      email,
      role: "student",
      profile: {
        educationLevel: "bachelor",
      },
      bookmarks: [],
    }),
    []
  );

  const hydrateUser = useCallback(async () => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        if (!ENABLE_BACKEND_AUTH) {
          setIsLoading(false);
          return;
        }
      }
      if (!ENABLE_BACKEND_AUTH) {
        setIsLoading(false);
        return;
      }

      // Check for token before making API call to avoid 401
      const token = localStorage.getItem("applybro_access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axiosClient.get<{ status: string; data: { user: any } }>("/auth/me");

      if (response.data.status === "success" && response.data.data?.user) {
        const apiUser = response.data.data.user;
        const user: User = {
          id: apiUser._id || apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role as UserRole,
          avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
          profile: apiUser.profile,
          bookmarks: apiUser.bookmarks || [],
        };
        setUser(user);
        persistUser(user);
      }
    } catch {
      // If auth fails, clear stored user
      setUser(null);
      persistUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      persistUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      if (!ENABLE_BACKEND_AUTH) {
        const mockUser = buildMockUser(email);
        setUser(mockUser);
        persistUser(mockUser);
        return true;
      }
      const response = await axiosClient.post<{ status: string; data: AuthResponse }>("/auth/login", {
        email,
        password,
      });

      if (response.data.status !== "success" || !response.data.data) {
        console.error("Login failed: Invalid response format");
        return false;
      }

      const { user: apiUser, accessToken, refreshToken } = response.data.data;

      const user: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role as UserRole,
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
        profile: apiUser.profile,
        bookmarks: apiUser.bookmarks || [],
      };

      setAuthTokens({ accessToken, refreshToken });
      setUser(user);
      persistUser(user);
      return true;
    } catch (error) {
      console.error("Failed to login", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (ENABLE_BACKEND_AUTH) {
        await axiosClient.post("/auth/logout");
      }
    } catch (error) {
      console.warn("Error during logout", error);
    } finally {
      clearAuthTokens();
      persistUser(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!ENABLE_BACKEND_AUTH) {
      return;
    }
    try {
      const response = await axiosClient.get<{ status: string; data: { user: any } }>("/auth/me");

      if (response.data.status === "success" && response.data.data?.user) {
        const apiUser = response.data.data.user;
        const user: User = {
          id: apiUser._id || apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role as UserRole,
          avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
          profile: apiUser.profile,
          bookmarks: apiUser.bookmarks || [],
        };
        setUser(user);
        persistUser(user);
      }
    } catch (error) {
      console.error("Failed to refresh user profile", error);
      await logout();
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    logout,
    refreshUser,
  };

  if (isLoading) {
    return (
      <Loader
        label="Preparing ApplyBro..."
        size="lg"
        className="min-h-screen bg-white"
      />
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
