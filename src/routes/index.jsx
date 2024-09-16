import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorPage from "../pages/ErrorPage";
import Dashboard from "../pages/Dashboard";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";

// Lazy load components for better performance
const ManLayout = lazy(() => import("../layouts/man"));
const Products = lazy(() => import("../pages/Products"));
const Login = lazy(() => import("../pages/Login"));
const Users = lazy(() => import("../pages/Users"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        }
      >
        <AuthGuard>
          <ManLayout />
        </AuthGuard>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },
  {
    path: "/login",
    errorElement: <ErrorPage />,
    element: (
      <GuestGuard>
        <Login />,
      </GuestGuard>
    ),
  },
]);

export default router;
