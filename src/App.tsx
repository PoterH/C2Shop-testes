import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SupportPage } from './pages/SupportPage';
import { FAQPage } from './pages/FAQPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ThankYouPage } from './pages/ThankYouPage';

import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';

// Scroll to top automatically when navigating to a new route
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Set default page title
  useEffect(() => {
    document.title = 'C2Tech | Softwares Profissionais com Acesso Vitalício';
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white text-slate-800 antialiased selection:bg-accent-blue/10 selection:text-accent-blue">
          {/* Sticky Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/produto/:slug" element={<ProductDetail />} />
              <Route path="/como-funciona" element={<HowItWorksPage />} />
              <Route path="/suporte" element={<SupportPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/termos" element={<TermsPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/obrigado" element={<ThankYouPage />} />
              
              {/* Fallback route - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />

          {/* Cart Drawer */}
          <CartDrawer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
