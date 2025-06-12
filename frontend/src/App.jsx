import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <main>
        <Toaster richColors position="top-right" />

        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
