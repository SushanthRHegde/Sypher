
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Notes", path: "/notes" },
  { name: "Goals", path: "/goals" },
  { name: "Community", path: "/community" },
  { name: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed w-full px-2 sm:px-4 py-2 sm:py-3 z-50">
      <div className="max-w-7xl mx-auto glass-card px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-1 sm:gap-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-sypher-accent flex items-center justify-center text-white font-bold text-sm sm:text-base">
            S
          </div>
          <span className="font-bold text-lg sm:text-xl">SYPHER</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-gray-300 hover:text-sypher-accent transition-colors px-2 sm:px-3 py-2 block text-sm sm:text-base",
                  isActive && "text-sypher-accent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <GoogleSignIn />
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-gray-300 hover:text-sypher-accent transition-colors p-2 sm:p-3"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] mt-1 sm:mt-2 mr-4  ml-4 py-3 sm:py-4 px-3 sm:px-4 flex flex-col gap-2 sm:gap-4 animate-in slide-in-from-top duration-200 border border-gray-800 rounded-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-gray-300 hover:text-sypher-accent transition-colors px-2 sm:px-3 py-2 block w-full text-sm sm:text-base",
                  isActive && "text-sypher-accent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="py-2 sm:py-3">
            <GoogleSignIn />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
