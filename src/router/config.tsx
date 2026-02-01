import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const HomePage = lazy(() => import('../pages/home/page'));
const ProductsPage = lazy(() => import('../pages/products/page'));
const BSFEducationPage = lazy(() => import('../pages/bsf-education/page'));
const ProductDetailPage = lazy(() => import('../pages/product-detail/page'));
const BlogPage = lazy(() => import('../pages/blog/page'));
const BlogDetailPage = lazy(() => import('../pages/blog-detail/page'));
const AboutPage = lazy(() => import('../pages/about/page'));
const ContactPage = lazy(() => import('../pages/contact/page'));
const CartPage = lazy(() => import('../pages/cart/page'));
const CheckoutPage = lazy(() => import('../pages/checkout/page'));
const ProfilePage = lazy(() => import('../pages/profile/page'));
const OrderTrackingPage = lazy(() => import('../pages/order-tracking/page'));
const SellerProfilePage = lazy(() => import('../pages/seller-profile/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const RegisterPage = lazy(() => import('../pages/register/page'));
const SellerRegisterPage = lazy(() => import('../pages/seller-register/page'));
const AdminDashboard = lazy(() => import('../pages/admin-dashboard/page'));
const SellerDashboard = lazy(() => import('../pages/seller-dashboard/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:id',
    element: <BlogDetailPage />,
  },
  {
    path: '/bsf-education',
    element: <BSFEducationPage />,
  },
  {
    path: '/order-tracking',
    element: <OrderTrackingPage />,
  },
  {
    path: '/seller-profile',
    element: <SellerProfilePage />,
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/admin-login',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/seller-login',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/seller-register',
    element: <SellerRegisterPage />,
  },
  {
    path: '/admin-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']} fallbackPath="/login">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/seller-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['seller', 'admin']} fallbackPath="/login">
        <SellerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
