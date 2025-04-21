
import { Link, useLocation } from "react-router-dom";
import { Bell, Home, Phone, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Phone, path: "/contacts", label: "Contacts" },
    { icon: Clock, path: "/history", label: "History" },
    { icon: User, path: "/profile", label: "Profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path} 
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2 text-xs font-medium transition-colors",
              location.pathname === path 
                ? "text-raksha-purple" 
                : "text-gray-500 hover:text-raksha-purple-dark"
            )}
          >
            <Icon className={cn(
              "h-6 w-6 mb-1",
              location.pathname === path && "animate-bounce-soft"
            )} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
