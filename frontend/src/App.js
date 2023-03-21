import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return(
    <div className="App" >
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </Router>
      </div >
  );
}

export default App;
