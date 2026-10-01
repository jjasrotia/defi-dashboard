"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";
import { restoreSession } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import AuthGate from "@/components/auth/AuthGate";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      <SessionBootstrap />
      <AuthGate>{children}</AuthGate>
    </Provider>
  );
}

function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return null;
}