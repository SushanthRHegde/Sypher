
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
  { name: "Dashboard", path: "/dashboard" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed w-full px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto glass-card px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-sypher-accent flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-bold text-xl">SYPHER</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-gray-300 hover:text-sypher-accent transition-colors px-3 py-2 block",
                  isActive && "text-sypher-accent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <GoogleSignIn />
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-300 hover:text-sypher-accent transition-colors"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-card mt-2 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-gray-300 hover:text-sypher-accent transition-colors px-3 py-2 block w-full",
                  isActive && "text-sypher-accent"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="py-2">
            <GoogleSignIn />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
