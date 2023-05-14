import React, { PropsWithChildren } from "react";
import SideBar from "./Sidebar";
import Footer from "./Footer";
import NavbarWebsite from "./NavbarWebsite";

const LayoutWebsite = ({ children }) => {
  return (
    <>
    <NavbarWebsite />
      {/* <Navbar /> */}
      {/* <SideBar /> */}
      {children}
      <Footer />
    </>
  );
};
export default LayoutWebsite;