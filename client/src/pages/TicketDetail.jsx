import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { request } from '../api';

export default function TicketDetail() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user.role === 'admin';

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setTicket(await request(`/tickets/${id}`));
        setComments(await request(`/tickets/${id}/comments`));
        if (isAdmin) setAdmins(await request('/users'));
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, [id, isAdmin]);

  const addComment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const c = await request(`/tickets/${id}/comments`, 'POST', { text });
      setComments([...comments, c]);
      setText('');
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTicket = async (changes) => {
    setError('');
    try {
      await request(`/tickets/${id}`, 'PUT', changes);
      // reload so populated names are shown correctly
      setTicket(await request(`/tickets/${id}`));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !ticket) {
    return (
      <div className="container wide">
        <p className="error">{error}</p>
        <Link to="/">Back</Link>
      </div>
    );
  }
  if (!ticket) return <div className="container wide">Loading...</div>;

  return (
    <div className="container wide">
      <Link to="/">&larr; Back to tickets</Link>
      <h2>{ticket.title}</h2>
      <p>
        <span className={`badge ${ticket.priority}`}>{ticket.priority}</span>
        <span className="badge">{ticket.status.replace('_', ' ')}</span>
        <span className="badge">{ticket.category}</span>
      </p>
      <p>{ticket.description}</p>
      <p>
        <small>
          Created by {ticket.createdBy ? ticket.createdBy.name : 'unknown'} on{' '}
          {new Date(ticket.createdAt).toLocaleString()}
          <br />
          Assigned to: {ticket.assignedTo ? ticket.assignedTo.name : 'nobody'}
        </small>
      </p>

      {isAdmin && (
        <div className="admin-box">
          <strong>Admin controls</strong>
          <label>Status</label>
          <select
            value={ticket.status}
            onChange={(e) => updateTicket({ status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <label>Assign to</label>
          <select
            value={ticket.assignedTo ? ticket.assignedTo._id : ''}
            onChange={(e) =>
              updateTicket({ assignedTo: e.target.value || null })
            }
          >
            <option value="">Nobody</option>
            {admins.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((c) => (
        <div className="comment" key={c._id}>
          <small>
            {c.author ? c.author.name : 'Unknown'} &middot;{' '}
            {new Date(c.createdAt).toLocaleString()}
          </small>
          <div>{c.text}</div>
        </div>
      ))}

      <form onSubmit={addComment}>
        <label>Add a comment</label>
        <textarea
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Post comment</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}