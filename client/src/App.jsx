import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NewTicket from './pages/NewTicket';

// Only lets logged-in users through
function Private({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Private>
              <Home />
            </Private>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <Private>
              <NewTicket />
            </Private>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}