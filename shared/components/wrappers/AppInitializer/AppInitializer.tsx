import { PropsWithChildren, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { showNotification } from "@mantine/notifications";

import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS,
} from "@/shared/constants/app.constants";
import { useAppDispatch } from "@/shared/redux/hooks";
import { setUser, clearUser } from "@/shared/redux/reducers/user.reducer";
import { useLazyMeQuery } from "@/shared/redux/rtk-apis/users/users.api";
import { setupAutoLogout } from "@/shared/utils/autoLogout";
import { parseApiErrorMessage } from "@/shared/utils/errors";

import { AppInitializerContext } from "./AppInitializerContext";

const AppInitializer = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [getMe, { isFetching, isLoading, error, data }] = useLazyMeQuery();

  const [initialized, setInitialized] = useState(false);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY) : null;

  useEffect(() => {
    if (accessToken) {
      getMe()
        .unwrap()
        .then((user) => {
          dispatch(setUser(user));
          setInitialized(true);
        })
        .catch((err) => {
          const errorMessage = parseApiErrorMessage(err);

          if (err?.status !== 401) {
            showNotification({
              title: "Something went wrong",
              message: errorMessage,
              autoClose: NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS,
              color: "red",
            });
          } else {
            dispatch(clearUser());
            router.push("/login");
          }
          setInitialized(true);
        });
    } else {
      setInitialized(true);
    }

    const cleanup = setupAutoLogout(dispatch, router);
    return () => {
      cleanup();
    };
  }, [accessToken, dispatch, getMe, router]);

  return (
    <AppInitializerContext.Provider
      value={{
        isLoading: isFetching || isLoading || !initialized,
        error,
        user: data,
        getMe,
      }}
    >
      {children}
    </AppInitializerContext.Provider>
  );
};

export default AppInitializer;
