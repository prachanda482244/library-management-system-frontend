import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import About from "./pages/About";
import RegisterForm from "./pages/RegisterForm";
import ProtectedRoutes from "./auth/auth";
import { Toaster } from "react-hot-toast";
import Dashboard from "./dashboard/Dashboard";
import DashboardUser from "./dashboard/components/DashboardUser";
import DashboardBook from "./dashboard/components/DashboardBook";
import CreateBook from "./dashboard/components/CreateBook";
import EditBook from "./dashboard/components/EditBook";
import AdvancedSearchPage from "./components/AdvancedSearchPage";
import Chart from "./dashboard/Chart";
import OtherUserProfile from "./pages/OtherUserProfile";
import Chat from "./pages/Chat";
import { useDispatch } from "react-redux";
import { disconnectSocket, initializeSocket } from "./store/slices/socketSlice";
import { useEffect } from "react";
import BookDetailsPage from "./pages/BookDetailsPage";
import Booksettings from "./pages/Booksettings";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import GetRequestApproval from "./dashboard/components/GetRequestApproval";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import DashboardOrder from "./dashboard/components/DashboardOrder";
import DashboardOrderDetails from "./dashboard/components/DashBoardOrderDetails";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");
  return (
    <div>
      <Toaster />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<RegisterForm />} />
        <Route path="/search" element={<AdvancedSearchPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />}/>
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile/:userId" element={<OtherUserProfile />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/read/:bookId" element={<BookDetailsPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="charts" element={<Chart />} />
            <Route path="order" element={<DashboardOrder />} />
            <Route path="order/:id" element={<DashboardOrderDetails />} />
            <Route path="customers" element={<DashboardUser />} />
            <Route path="request-approval" element={<GetRequestApproval />} />
            <Route path="books" element={<DashboardBook />} />
            <Route path="book/create" element={<CreateBook />} />
            <Route path="books/setting" element={<Booksettings />} />
            <Route
              path="book/edit/:id"
              element={<EditBook isProduct={true} />}
            />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
