
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import Notes from "@/pages/Notes";
import CreateNote from "@/pages/notes/CreateNote";
import Portfolio from "@/pages/Portfolio";
import NotFound from "./pages/NotFound";
import Goals from "./pages/Goals";
import ViewNote from "./pages/notes/ViewNote";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/dashboard" element={<Layout ><Dashboard /></Layout>} />
          
            <Route path="/notes" element={<Layout ><Notes /></Layout>} />
            <Route path="/notes/create" element={<Layout ><CreateNote /></Layout>} />
            <Route path="/notes/view/:id" element={<Layout ><ViewNote /></Layout>} />

            <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/goals" element={<Layout><Goals /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />

            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
