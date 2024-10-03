import React, { PropsWithChildren, useEffect, useState, useMemo } from "react";

import { useRouter } from "next/router";

import LoadingComponent from "../../LoadingComponent";
import { useSessionContext } from "../AppInitializer/AppInitializerContext";

const RedirectingPage = () => (
  <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
    <h1>Redirecting...</h1>
    <p>Please wait while we take you to the login page.</p>
  </div>
);

const AuthGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { isLoading, error, user } = useSessionContext();
  const isUnauthenticated = !isLoading && (error || !user);
  const [showRedirectPage, setShowRedirectPage] = useState(false);

  const restrictedRoutesForAuthenticatedUsers = useMemo(
    () => ["/", "/registration/student", "/registration/teacher"],
    [],
  );

  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;

    const isLoginPage = router.pathname === "/login";
    const isRestrictedPageForAuthenticated = restrictedRoutesForAuthenticatedUsers.includes(
      router.pathname,
    );

    if (isUnauthenticated && !isLoginPage && !isRestrictedPageForAuthenticated) {
      setShowRedirectPage(true);
      setTimeout(() => {
        router.push("/login");
      }, 500);
      return;
    }

    if (!isUnauthenticated && (isLoginPage || isRestrictedPageForAuthenticated)) {
      router.push("/dashboard");
      return;
    }
    if (isLoginPage) {
      setShowRedirectPage(false);
    }
  }, [router, isLoading, error, isUnauthenticated, restrictedRoutesForAuthenticatedUsers]);

  if (isLoading) {
    return <LoadingComponent visible={true} />;
  }
  if (showRedirectPage) {
    return <RedirectingPage />;
  }

  return <>{children}</>;
};

export default AuthGuard;
