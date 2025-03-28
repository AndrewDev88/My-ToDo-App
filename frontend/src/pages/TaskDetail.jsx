import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/tasks/${id}`, { withCredentials: true })
      .then((res) => {
        if (!res.data || !res.data.id) {
          navigate('/not-found');
        } else {
          setTask(res.data);
        }
      })
      .catch((err) => {
        console.error('Error loading task:', err);
        navigate('/not-found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const toggleStatus = () => {
    const newStatus =
      task.status === 'pending'
        ? 'in progress'
        : task.status === 'in progress'
        ? 'pending'
        : 'pending';

    axios
      .put(
        `http://localhost:3000/api/tasks/${task.id}`,
        { status: newStatus },
        { withCredentials: true }
      )
      .then((res) => setTask(res.data))
      .catch((err) => console.error('Error updating task:', err));
  };

  const completeTask = () => {
    axios
      .put(
        `http://localhost:3000/api/tasks/${task.id}`,
        { status: 'completed' },
        { withCredentials: true }
      )
      .then((res) => setTask(res.data))
      .catch((err) => console.error('Error completing task:', err));
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/api/tasks/${task.id}`, { withCredentials: true })
      .then(() => navigate('/tasks'))
      .catch((err) => console.error('Error deleting task:', err));
  };

  const handleEdit = () => {
    navigate(`/tasks/create?edit=${task.id}`);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{task.title}</h2>
      <p style={descriptionStyle}>{task.description || 'No description'}</p>
      <p style={statusStyle}>
        <strong>Status:</strong> {task.status}
      </p>

      <div style={buttonsContainer}>
        {user?.role === 'admin' ? (
          <button onClick={handleDelete} style={buttonStyle('#dc3545')}>
            Delete
          </button>
        ) : (
          <>
            {task.status === 'pending' && (
              <button onClick={toggleStatus} style={buttonStyle('#28a745')}>
                Start
              </button>
            )}

            {task.status === 'in progress' && (
              <>
                <button
                  onClick={toggleStatus}
                  style={{ ...buttonStyle('#dc3545'), marginRight: '0.5rem' }}
                >
                  Stop
                </button>
                <button onClick={completeTask} style={buttonStyle('#6c757d')}>
                  Complete
                </button>
              </>
            )}

            {task.status === 'completed' && (
              <p style={{ fontStyle: 'italic', color: 'green', marginBottom: '1rem' }}>
                Task completed
              </p>
            )}

            <div style={{ marginTop: '1rem' }}>
              {task.status !== 'completed' && (
                <button onClick={handleEdit} style={buttonStyle('#007bff')}>
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                style={{ ...buttonStyle('#dc3545'), marginLeft: '0.5rem' }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: '600px',
  margin: '2rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '1.8rem',
  marginBottom: '1rem',
  textAlign: 'center',
  color: '#333'
};

const descriptionStyle = {
  fontSize: '1rem',
  marginBottom: '1rem',
  color: '#555',
  lineHeight: '1.5',
  textAlign: 'center'
};

const statusStyle = {
  fontSize: '1rem',
  marginBottom: '1.5rem',
  textAlign: 'center'
};

const buttonsContainer = {
  textAlign: 'center'
};

function buttonStyle(bgColor) {
  return {
    padding: '0.5rem 1rem',
    background: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  };
}
