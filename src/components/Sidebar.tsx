
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Code, 
  Home, 
  MessageSquare, 
  Settings, 
  Target, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Stats", icon: BarChart3, path: "/dashboard/stats" },
  { name: "Notes", icon: BookOpen, path: "/notes" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Projects", icon: Code, path: "/projects" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Community", icon: MessageSquare, path: "/community" },
  { name: "Portfolio", icon: User, path: "/portfolio" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-full w-64 glass-card py-8 hidden md:block">
      <div className="px-6">
        <h2 className="text-xl font-bold mb-8">SYPHER</h2>
        
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  isActive
                    ? "bg-sypher-accent text-white"
                    : "text-gray-300 hover:bg-sypher-gray"
                )}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
