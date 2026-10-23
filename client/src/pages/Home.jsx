import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>
      <Link to="/tickets/new">
        <button>Submit a ticket</button>
      </Link>
      <button className="secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
}