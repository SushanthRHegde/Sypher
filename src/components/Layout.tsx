
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
