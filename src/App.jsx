import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { Products } from './pages/Products';
import { Brands } from './pages/Brands';
import { AboutUs } from './pages/AboutUs';
import { Layout } from './components/Layout';
import { FilterProvider } from './context/FilterProvider';
import CartProvider from './context/cart/cart-provider';
import { NotificationProvider } from './context/NotificationContext.jsx';
import './App.css';
import { ProductPage } from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <CartProvider>
          <FilterProvider>
          <Routes>
            <Route path="/" element={
              <Layout>
                <MainPage />
              </Layout>
            } />
            <Route path="/productos" element={
              <Layout>
                <Products />
              </Layout>
            } />
            <Route path="/marcas" element={
              <Layout>
                <Brands />
              </Layout>
            } />
            <Route path="/nosotros" element={
              <Layout>
                <AboutUs />
              </Layout>
            } />
            <Route path="/productos/:id" element={
              <Layout>
                <ProductPage />
              </Layout>
            } />
            <Route path="/contacto" element={
              <Layout>
                <Contact />
              </Layout>
            } />
            <Route path="/carrito" element={
              <Layout>
                <CartPage />
              </Layout>
            } />
          </Routes>
          </FilterProvider>
        </CartProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
