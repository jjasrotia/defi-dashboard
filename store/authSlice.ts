import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
  error?: string;
}

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  error: string | null;
}

const initialState: AuthState = {
  status: "checking",
  token: null,
  user: null,
  error: null,
};

export const login = createAsyncThunk<
  AuthResponse,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = (await response.json()) as AuthResponse;

    if (!response.ok || !data.token || !data.user) {
      return rejectWithValue(data.error ?? "Unable to sign in. Please try again.");
    }

    window.sessionStorage.setItem("defix-session-token", data.token);
    return data;
  } catch {
    return rejectWithValue("The sign-in service is unavailable. Please try again.");
  }
});

export const restoreSession = createAsyncThunk<AuthResponse | null>(
  "auth/restoreSession",
  async () => {
    const token = window.sessionStorage.getItem("defix-session-token");
    if (!token) return null;

    try {
      const response = await fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) {
        window.sessionStorage.removeItem("defix-session-token");
        return null;
      }
      return { token, ...(await response.json() as { user: AuthUser }) };
    } catch {
      window.sessionStorage.removeItem("defix-session-token");
      return null;
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const token = window.sessionStorage.getItem("defix-session-token");
  try {
    if (token) {
      await fetch("/api/auth/session", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
    // Clear the local session even when the server cannot be reached.
  } finally {
    window.sessionStorage.removeItem("defix-session-token");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "checking";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.token = null;
        state.user = null;
        state.error = action.payload ?? "Unable to sign in.";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = action.payload ? "authenticated" : "unauthenticated";
        state.token = action.payload?.token ?? null;
        state.user = action.payload?.user ?? null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;