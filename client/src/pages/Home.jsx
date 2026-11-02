import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../api';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request('/tickets')
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const shown = tickets.filter(
    (t) =>
      (!status || t.status === status) && (!priority || t.priority === priority)
  );

  return (
    <div className="container wide">
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>
      <Link to="/tickets/new">
        <button>Submit a ticket</button>
      </Link>
      <button className="secondary" onClick={logout}>
        Logout
      </button>

      <h3>{user.role === 'admin' ? 'All tickets' : 'My tickets'}</h3>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && shown.length === 0 && <p>No tickets found.</p>}

      {shown.map((t) => (
        <Link key={t._id} to={`/tickets/${t._id}`} className="ticket-row">
          <strong>{t.title}</strong>
          <div>
            <span className={`badge ${t.priority}`}>{t.priority}</span>
            <span className="badge">{t.status.replace('_', ' ')}</span>
            <span className="badge">{t.category}</span>
            {user.role === 'admin' && t.createdBy && (
              <small>by {t.createdBy.name}</small>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}