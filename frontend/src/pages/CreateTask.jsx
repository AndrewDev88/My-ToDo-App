import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CreateTask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editId) {
      axios
        .get(`http://localhost:3000/api/tasks/${editId}`, { withCredentials: true })
        .then((res) => {
          setTitle(res.data.title || '');
          setDescription(res.data.description || '');
        })
        .catch((err) =>
          console.error('Error loading task for editing:', err)
        );
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/tasks/${editId}`,
          { title, description },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          'http://localhost:3000/api/tasks',
          { title, description },
          { withCredentials: true }
        );
      }
      navigate('/tasks');
    } catch (error) {
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    marginTop: 0,
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>{editId ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '80px' }}
        />

        <button type="submit" style={buttonStyle}>
          {editId ? 'Save Changes' : 'Create'}
        </button>
      </form>
    </div>
  );
}
