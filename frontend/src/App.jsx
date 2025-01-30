
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainWeb from "./Pages/Website/MainWeb";
import Login from "./Pages/Website/Login";
import Register from "./Pages/Website/Register";
import Profile from "./Pages/Website/Profile";
import Tasks from "./Pages/Website/Tasks";
import AdminM from "./Pages/Admin/AdminM";
import Dashboard from "./Pages/Admin/Dashboard";
import ProtectedRoute from "./Pages/Website/ProtectedRoute";  // Import ProtectedRoute
import VerifyCode from "./Pages/Website/VerifyCode";

const App = () => {

  const route = createBrowserRouter([
    {
      path: "/",
      element: <MainWeb />,
      children: [
        {
          path: "",
          element: (
            <ProtectedRoute restricted={false}>
              <Tasks />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: (
            <ProtectedRoute restricted={true}>
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: "verify/:name",
          element: (
            <ProtectedRoute restricted={true}>
              <VerifyCode />
            </ProtectedRoute>
          ),
        },
        {
          path: "register",
          element: (
            <ProtectedRoute restricted={true}>
              <Register />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute restricted={false}>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminM />,
      children: [
        {
          path: "",
          element: <Dashboard />
        }
      ]
    }
  ]);

  return (
    <div className="">
      <RouterProvider router={route} />
    </div>
  );
};

export default App;
