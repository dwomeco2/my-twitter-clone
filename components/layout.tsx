import { type ComponentProps, type PropsWithChildren } from "react";
import Head from "components/head";

export default function layout(
  props: PropsWithChildren<ComponentProps<"div">>
) {
  const { children, ...rest } = props;
  return (
    <>
      <Head />
      <main {...rest}>{children}</main>
    </>
  );
}
