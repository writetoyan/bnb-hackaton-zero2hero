import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <SideBar />
      {children}
      <Footer />
    </>
  );
};
export default Layout;