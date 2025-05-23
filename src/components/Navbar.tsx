
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NavbarProps {
  showMenuButton?: boolean;
}

const Navbar = ({ showMenuButton = true }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);

  const handleProfile = () => {
    navigate("/settings");
    toast({
      title: "Profile",
      description: "View and edit your profile information"
    });
  };

  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications"
    });
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
      <div className="container flex h-16 items-center px-4 gap-1 sm:gap-4">
        {showMenuButton && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex-1">
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            showSearch ? "w-full" : "w-0"
          )}>
            {showSearch && (
              <input 
                type="text" 
                placeholder="Search expenses, categories..." 
                className="w-full p-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(!showSearch)} 
            className="transition-all duration-300 hover:bg-primary/10"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotification}
            className="transition-all duration-300 hover:bg-primary/10 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="transition-all duration-300 hover:bg-primary/10"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleProfile}
            className="transition-all duration-300 hover:bg-primary/10"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
