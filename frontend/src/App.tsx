import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import { AuthProvider } from 'react-auth-kit';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Websites from './pages/Websites';

function App() {
  return (
    // Wrap the whole app in the AuthProvider to have access to 'react-auth-kit' library functionality
    <AuthProvider
      authType='cookie'
      authName='_auth'
      cookieDomain={window.location.hostname}
      cookieSecure={false}>
        <div className='bg-primary w-full overflow-hidden'>
          {/* React Router */}
          <BrowserRouter>
            {/* Navbar is outside Routes, which means it's shared between pages */}
            <Navbar />
            {/* Routes */}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/websites' element={<Websites />} />
            </Routes>
          </BrowserRouter>
        </div>
    </AuthProvider>
  )
}

export default App