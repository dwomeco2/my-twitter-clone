import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
