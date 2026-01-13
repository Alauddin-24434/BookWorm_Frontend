// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: Role;
  password: string;
  followers: string[];
  following: string[];
  library: string[];
  history: string[];
}

// Redux auth state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: "bookWormAuth",
  initialState,
  reducers: {
    // When API call starts
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    // When login/signup is successful
    setUser(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    // When login/signup fails
    authFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
    // Logout
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, authStart, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.bookWormAuth.user;
export const selectCurrentToken = (state: RootState) => state.bookWormAuth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.bookWormAuth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.bookWormAuth.loading;
export const selectAuthError = (state: RootState) => state.bookWormAuth.error;
