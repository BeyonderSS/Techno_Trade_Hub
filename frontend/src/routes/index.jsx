import DashboardLayout from "../layout/DashboardLayout";
import MainLayout from "../layout/MainLayout";
import Home from "../pages";
import DashboardHomePage from "../pages/Dashboard";

const routes = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <DashboardHomePage />
      </DashboardLayout>
    ),
  },

  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
];

export default routes;
