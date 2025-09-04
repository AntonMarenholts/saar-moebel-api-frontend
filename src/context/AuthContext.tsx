import { createContext } from "react";
import type { CurrentUser, Category } from "../types";

export interface AuthContextType {
  user: CurrentUser | null;
  login: (userData: CurrentUser) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  categories: Category[];
}

export const AuthContext = createContext<AuthContextType | null>(null);