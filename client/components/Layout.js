import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import SideBar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <SideBar />
      {children}
    </>
  );
};
export default Layout;