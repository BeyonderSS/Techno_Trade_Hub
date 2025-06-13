"use client";

import { Link } from "react-router-dom";
import { Camera, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { useBreadcrumbTitle } from "./breadcrumb-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";

function AppNavbar() {
  const breadcrumbTitle = useBreadcrumbTitle();

  return (
    <TooltipProvider>
      <nav className="border-2 border-white rounded-xl md:mx-10 mx-6 my-6">
        <div className="mx-auto px-6 py-1 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              <div className="flex items-center">
              <h1 className="md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {breadcrumbTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-between mx-3">
                <div className="relative cursor-pointer">
                  <img
                    src={
                      "https://img.icons8.com/3d-fluency/94/guest-male--v2.png"
                    }
                    alt="User Avatar"
                    className="md:h-15 h-12 w-12 md:w-15 rounded-full border border-white object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-black/60 shadow-md hover:bg-gray-100">
                    <Camera className="h-2 w-2 text-gray-900 cursor-pointer" />
                  </div>
                </div>
                <p className="font-semibold text-sm ml-3">Hi,{"user?.name"}</p>
              </div>

              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link to="/">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-purple-100 hover:text-blue-700"
                    >
                      <Home className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Home</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}

export default AppNavbar;
