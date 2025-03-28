import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const endpoint =
      user.role === 'admin'
        ? 'http://localhost:3000/api/tasks/all'
        : 'http://localhost:3000/api/tasks';

    axios
      .get(endpoint, { withCredentials: true })
      .then((res) => {
        setTasks(res.data.reverse());
      })
      .catch((err) => console.error('Error loading tasks:', err));
  }, [user]);

  const toggleStatus = (task) => {
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
      .then((res) => {
        const updatedTask = res.data;
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
      })
      .catch((err) => console.error('Error updating task status:', err));
  };

  const completeTask = (task) => {
    axios
      .put(
        `http://localhost:3000/api/tasks/${task.id}`,
        { status: 'completed' },
        { withCredentials: true }
      )
      .then((res) => {
        const updatedTask = res.data;
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
      })
      .catch((err) => console.error('Error completing task:', err));
  };

  const handleDelete = (task) => {
    axios
      .delete(`http://localhost:3000/api/tasks/${task.id}`, { withCredentials: true })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      })
      .catch((err) => console.error('Error deleting task:', err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h1 style={{ margin: 0 }}>
          {user?.role === 'admin' ? 'User tasks' : 'My tasks'}
        </h1>
        {user?.role !== 'admin' && (
          <Link
            to="/tasks/create"
            style={{
              background: '#007bff',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            Create task
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <p>
          {user?.role === 'admin'
            ? 'No tasks yet.'
            : 'No tasks. You can create a new one!'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                marginBottom: '1.5rem',
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem' }}>{task.title}</h3>
                  <p style={{ margin: '0.3rem 0 1rem', color: '#555' }}>
                    {task.description || 'No description'}
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong>Status:</strong> {task.status}
                  </p>
                  {user?.role === 'admin' && task.User?.username && (
                  <p style={{ marginBottom: '1rem', color: '#333' }}>
                    <strong>Task owner:</strong> {task.User.username}
                  </p>
                )}
                </div>
                <Link
                  to={`/tasks/${task.id}`}
                  style={{
                    fontSize: '1.5rem',
                    textDecoration: 'none',
                    marginLeft: '1rem'
                  }}
                >
                  ↗
                </Link>
              </div>

              {user?.role === 'admin' ? (
                <button
                  onClick={() => handleDelete(task)}
                  style={buttonStyle('#dc3545')}
                >
                  Delete
                </button>
              ) : (
                <>
                  {task.status === 'pending' && (
                    <button
                      onClick={() => toggleStatus(task)}
                      style={buttonStyle('#28a745')}
                    >
                      Start
                    </button>
                  )}

                  {task.status === 'in progress' && (
                    <>
                      <button
                        onClick={() => toggleStatus(task)}
                        style={{ ...buttonStyle('#dc3545'), marginRight: '0.5rem' }}
                      >
                        Stop
                      </button>
                      <button
                        onClick={() => completeTask(task)}
                        style={buttonStyle('#6c757d')}
                      >
                        Complete
                      </button>
                    </>
                  )}

                  {task.status === 'completed' && (
                    <p style={{ fontStyle: 'italic', color: 'green' }}>
                      Task completed
                    </p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
