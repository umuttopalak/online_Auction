import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider, RequireAuth } from 'react-auth-kit';

function App() {
  return (
    <div className="App" >
      <AuthProvider
        authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={false}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path='/asd' element={
              <RequireAuth loginPath='/login'><Home />
              </RequireAuth>}>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div >
  );
}

export default App;
