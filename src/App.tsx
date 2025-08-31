import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import EncoderDecoder from "@/components/EncoderDecoder";
import PayloadDatabase from "@/components/PayloadDatabase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="h-12 flex items-center border-b border-border bg-card px-4">
                <SidebarTrigger />
                <div className="ml-4 text-sm text-muted-foreground">
                  Script Kiddies Tool lol
                </div>
              </header>
              <Routes>
                <Route path="/" element={<EncoderDecoder />} />
                <Route path="/payload-database" element={<PayloadDatabase />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
