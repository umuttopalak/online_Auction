import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogRes from './pages/LogReg';
import { AuthProvider, RequireAuth } from 'react-auth-kit';
import Auction from './pages/Auction';
import './LogRegPage.css'

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
            <Route path="/" element={<LogRes />} />
            <Route path='/login' element={<LogRes/>}/>
            <Route path='/home' element={
              <RequireAuth loginPath='/login'><Auction />
              </RequireAuth>}>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div >
  );
}

export default App;
