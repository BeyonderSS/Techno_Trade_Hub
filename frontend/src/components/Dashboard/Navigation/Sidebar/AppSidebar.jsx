import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import SidebarMenuContent from "./SidebarMenuContent";
import { toast } from "sonner"; // Import toast from sonner
import { LogOut } from "lucide-react";

// Sidebar Header Component
function SidebarHeaderContent() {
  return (
    <SidebarHeader>
      <SidebarMenuButton
        className="h-auto flex justify-center items-center"
        asChild
      >
        <Link to="#a">
          <img
            src={"/logo.png"}
            className="h-20 w-20 text-gray-900 dark:text-purple rounded-2xl"
            alt="Logo" // Added alt text for accessibility
          />
        </Link>
      </SidebarMenuButton>
    </SidebarHeader>
  );
}

// Main AppSidebar Component
export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.clear();

      toast.success("Logged out successfully!"); // Sonner toast for success
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again."); // Sonner toast for error
    }
  };

  return (
    <Sidebar variant="floating" className="" collapsible="icon">
      <SidebarHeaderContent />
      <SidebarContent>
        <SidebarMenuContent />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <button
            onClick={handleLogout}
            className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <LogOut className="w-5 h-5 text-white" />
            Logout
          </button>
        </SidebarMenuButton>
      </SidebarFooter>

    </Sidebar>
  );
}
