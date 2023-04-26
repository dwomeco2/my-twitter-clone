import { signOut } from "next-auth/react";
import React, { type ComponentProps } from "react";

const Header = (props: ComponentProps<"header">) => {
  return (
    <header {...props}>
      <button
        type="button"
        className="ml-auto w-40 rounded-md border border-rose-400 bg-transparent px-8 py-2"
        onClick={() => void signOut()}
      >
        Sign Out
      </button>
    </header>
  );
};

export default Header;
