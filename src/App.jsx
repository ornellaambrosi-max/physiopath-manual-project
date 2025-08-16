import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Screening from "./pages/Screening";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/screening" element={<Screening />} />
      </Routes>
    </Router>
  );
}

export default App;
