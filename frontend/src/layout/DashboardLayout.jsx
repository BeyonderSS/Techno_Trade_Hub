import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Dashboard/Navigation/Sidebar/AppSidebar";
import AppNavbar from "../components/Dashboard/Navigation/AppNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full min-h-screen backdrop-blur-md bg-white/10 ">
        <AppNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
