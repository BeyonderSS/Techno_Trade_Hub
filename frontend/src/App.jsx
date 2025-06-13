import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import { Toaster } from "sonner";
import { SessionProvider } from "./context/SessionContext";

function App() {
  return (
    <Router>
      <SessionProvider>
        <main>
          <Toaster richColors position="top-right" />

          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </main>
      </SessionProvider>
    </Router>
  );
}

export default App;
