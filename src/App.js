import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import ConfirmEmail from "./components/confirmEmail";
import Main from "./pages/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmar" element={<ConfirmEmail />} /> 
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;

