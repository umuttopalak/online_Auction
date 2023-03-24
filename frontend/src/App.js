import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import LogRes from './pages/LogReg';
import { AuthProvider, RequireAuth } from 'react-auth-kit';
import Auction from './pages/Auction';


function App() {
  // return (
  //   <div className="App" >
  //     <AuthProvider
  //       authType={'cookie'}
  //       authName={'_auth'}
  //       cookieDomain={window.location.hostname}
  //       cookieSecure={false}>
  //       <Router>
  //         <Routes>
  //           <Route path="/" element={<Layout />}>
  //             <Route path="/home" element={<Home />} />
  //             <Route path="/login" element={<Login />} />
  //             <Route path="/register" element={<Register />} />
  //           </Route>
  //           <Route path='/asd' element={
  //             <RequireAuth loginPath='/login'><Home />
  //             </RequireAuth>}>
  //           </Route>
  //         </Routes>
  //       </Router>
  //     </AuthProvider>
  //   </div >
  // );


  return (
        <div className="App" >
      <AuthProvider
        authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={false}>
        <Router>
          <Routes>
            <Route path="/">
              <Route path="login" element={<LogRes />} />

            </Route>
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
