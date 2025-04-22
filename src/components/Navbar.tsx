import { Link, useLocation } from "react-router-dom";
import { Bell, Home, Phone, User, Clock, Shield } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Phone, path: "/contacts", label: "Contacts" },
    { icon: Clock, path: "/history", label: "History" },
    { icon: User, path: "/profile", label: "Profile" }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Single-tier navbar with logo, tagline, and navigation */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-semibold text-purple-400">RakshaMitr</span>
        </div>
        <div className="ml-3 text-sm text-gray-400 italic hidden sm:block">
          Step with might, we're your shield in every light
        </div>
        
        {/* Navigation items pushed to right */}
        <div className="ml-auto flex items-center gap-6">
          {navItems.map(({ icon: Icon, path, label }) => (
            <Link 
              key={path} 
              to={path} 
              className={`
                flex flex-col items-center justify-center px-1 py-1 text-xs font-medium transition-colors duration-200
                ${location.pathname === path 
                  ? "text-purple-400" 
                  : "text-gray-400 hover:text-purple-300"}
              `}
            >
              <Icon className={`
                h-5 w-5 mb-1
                ${location.pathname === path && "text-purple-400"}
              `} />
              <span>{label}</span>
            </Link>
          ))}
          <Bell className="h-5 w-5 ml-2 text-gray-400 hover:text-purple-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;