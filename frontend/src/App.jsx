import { Routes, Route } from 'react-router-dom';

import About from './pages/About.jsx';
import AddProvider from './pages/AddProvider.jsx';
import FloatingAssistant from './components/FloatingAssistant.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import ProviderProfile from './pages/ProviderProfile.jsx';
import Providers from './pages/Providers.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/add-provider"
            element={
              <ProtectedRoute>
                <AddProvider />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}

export default App;
