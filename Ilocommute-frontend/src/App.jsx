import { Route, Routes } from "react-router-dom";
import {
  Home,
  Dashboard,
  Map,
  NotFound,
  RoutePage,
  User,
  RecycleBin,
  Stops,
} from "./pages";
import { MenuSidebar, ProtectedRoutes } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <main className="flex flex-grow bg-gray-50 min-h-screen h-auto">
        <MenuSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/routes" element={<RoutePage />} />
            <Route path="/dashboard/users" element={<User />} />
            <Route path="/map/:id" element={<Map />} />
            <Route path="/dashboard/recycle-bin" element={<RecycleBin />} />
            <Route path="/dashboard/stops" element={<Stops />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </main>
    </>
  );
};

export default App;
