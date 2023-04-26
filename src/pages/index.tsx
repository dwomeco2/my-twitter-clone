import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "components/layout";

const Home: NextPage = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const session = useSession();
  const me = session.data?.user;

  useEffect(() => {
    if (me) {
      setRedirecting(true);
      void router.push("/home");
    }
  }, [me, router]);

  return (
    <>
      <Layout className="flex h-full items-center justify-center">
        {redirecting ? (
          <div>Loading...</div>
        ) : (
          <button
            type="button"
            className="rounded-md border border-rose-400 bg-transparent px-8 py-2"
            onClick={() => void signIn("google", { callbackUrl: "/home" })}
          >
            sign in with google
          </button>
        )}
      </Layout>
    </>
  );
};

export default Home;
