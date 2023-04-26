import { type ComponentProps, type PropsWithChildren } from "react";
import Head from "components/head";
import Header from "./header";
import Footer from "./footer";

const HomeLayout = (props: PropsWithChildren<ComponentProps<"div">>) => {
  const { children, ...rest } = props;
  return (
    <>
      <Head />
      <main className=" grid gap-y-6" {...rest}>
        <div className="grid grid-cols-[320px_minmax(0px,_1280px)_320px]">
          <Header className="col-start-2 flex" />
        </div>
        <div className="grid grid-cols-[320px_minmax(0px,_1280px)_320px] ">
          <main className="col-start-2">{children}</main>
        </div>
        <div className="grid grid-cols-[320px_minmax(0px,_1280px)_320px] ">
          <Footer className="col-start-2 flex" />
        </div>
      </main>
    </>
  );
};
export default HomeLayout;
