import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InputDetails from "./pages/InputDetails";
import { Dashboard } from './pages/Dashboard';
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { CompleteProfile } from "./pages/CompleteProfile";
import { UploadResults } from './pages/UploadResults';
import { CareerDomains } from './pages/CareerDomains';
import { Resources } from './pages/Resources';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/input-details" element={<InputDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/upload-results" element={<UploadResults />} />
        <Route path="/career-domains" element={<CareerDomains />} />
        <Route path="/resources" element={<Resources />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
