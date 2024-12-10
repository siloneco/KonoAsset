import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/misc/ThemeProvider";
import MainSidebar from "@/components/layout/MainSidebar";

import "../index.css";
import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <MainSidebar />
        <Outlet />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  ),
});
