import { useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await request('/tickets', 'POST', {
        title,
        description,
        priority,
        category,
      });
      setSuccess('Ticket submitted!');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('other');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>New ticket</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Network</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}