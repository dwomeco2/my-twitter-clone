import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { type NextComponentType } from "next";

interface AppPageProps {
  session: Session;
}

type CustomAppProps = AppProps<AppPageProps> & {
  Component: NextComponentType & { auth?: boolean };
};

const MyApp: AppType<AppPageProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  return (
    <>
      <SessionProvider session={session}>
        {Component.auth ? (
          <Guarded>
            <Component {...pageProps} />
          </Guarded>
        ) : (
          <Component {...pageProps} />
        )}
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

function Guarded({ children }: { children: React.ReactElement }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    // Do nothing while loading
    if (status === "loading") return;

    if (!isUser) void router.push("/");
  }, [isUser, router, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null;
}
