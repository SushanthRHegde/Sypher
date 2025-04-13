
import { useState, ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20 flex">
        
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Mobile Sidebar */}
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSidebarOpen(false)}
            />
            
            <div
              className={`fixed top-0 left-0 h-full z-20 transition-transform transform md:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar />
            </div>
            
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar />
            </div>
          </>
        )}
        
        {/* Main Content */}
        <main className={`flex-grow ${showSidebar ? "md:ml-64" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
