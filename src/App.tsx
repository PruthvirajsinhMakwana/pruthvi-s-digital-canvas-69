import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Services from "./pages/Services";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Links from "./pages/Links";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSiteContent from "./pages/admin/AdminSiteContent";
import AdminServices from "./pages/admin/AdminServices";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import AdminBlogPreviewTest from "./pages/admin/AdminBlogPreviewTest";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLinks from "./pages/admin/AdminLinks";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCertifications from "./pages/admin/AdminCertifications";
import NotFound from "./pages/NotFound";
import { LeadCapturePopup } from "./components/LeadCapturePopup";

const queryClient = new QueryClient();

// Visitor tracking component
const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const getVisitorId = (): string => {
      const storageKey = 'visitor_id';
      let visitorId = localStorage.getItem(storageKey);
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(storageKey, visitorId);
      }
      return visitorId;
    };

    const trackVisit = async () => {
      // Don't track admin pages
      if (location.pathname.startsWith('/admin') || location.pathname === '/auth') {
        return;
      }
      
      try {
        const visitorId = getVisitorId();
        
        // Get location data from edge function
        let locationData = { ip: 'unknown', country: 'Unknown', city: 'Unknown', region: 'Unknown' };
        try {
          const response = await supabase.functions.invoke('get-visitor-location');
          console.log('Location response:', response);
          if (response.data) {
            locationData = response.data;
          }
        } catch (locError) {
          console.error('Error fetching location:', locError);
        }
        
        await supabase.from('page_views').insert({
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          visitor_ip: visitorId,
          real_ip: locationData.ip,
          country: locationData.country,
          city: locationData.city,
          region: locationData.region,
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [location.pathname]);

  return null;
};

// Show lead capture popup only on public pages
const LeadPopupGate = () => {
  const location = useLocation();
  const hidden = location.pathname.startsWith('/admin') || location.pathname === '/auth';
  if (hidden) return null;
  return <LeadCapturePopup />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VisitorTracker />
          <LeadPopupGate />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/links" element={<Links />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="content" element={<AdminSiteContent />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="certifications" element={<AdminCertifications />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/new" element={<AdminBlogEditor />} />
              <Route path="blog/edit/:id" element={<AdminBlogEditor />} />
              <Route path="blog/preview-test" element={<AdminBlogPreviewTest />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="links" element={<AdminLinks />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
