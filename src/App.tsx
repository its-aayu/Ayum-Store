import { Routes, Route } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { ShopPage } from '@/pages/Shop/ShopPage';
import { ProductPage } from '@/pages/Product/ProductPage';
import { CustomDesignPage } from '@/pages/CustomDesign/CustomDesignPage';
import { CartPage } from '@/pages/Cart/CartPage';
import { AboutPage } from '@/pages/About/AboutPage';
import { ServicesPage } from '@/pages/Services/ServicesPage';
import { ContactPage } from '@/pages/Contact/ContactPage';
import { FaqPage } from '@/pages/FAQ/FaqPage';
import {
  PrivacyPage,
  TermsPage,
  ShippingPage,
  ReturnsPage,
  RefundsPage,
  CancellationPage,
  CustomDesignPolicyPage,
} from '@/pages/Policies';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/custom" element={<CustomDesignPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/refunds" element={<RefundsPage />} />
        <Route path="/cancellation" element={<CancellationPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/custom-design-policy" element={<CustomDesignPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
