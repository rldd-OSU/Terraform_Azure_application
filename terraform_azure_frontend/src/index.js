import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    environment: '',
    source: '',
    owner: ''
  });
  const [activeTab, setActiveTab] = useState('create');
  const [toast, setToast] = useState(null);

  const showToast = (title, description, variant = 'default') => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_all_resources/');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      showToast("Error", "Failed to fetch resources", "destructive");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this is memoized once

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_resources/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResource),
      });
      
      if (response.ok) {
        showToast("Success", "Resource created successfully");
        setNewResource({ name: '', environment: '', source: '', owner: '' });
        fetchResources();
      } else {
        throw new Error('Failed to create resource');
      }
    } catch (error) {
      showToast("Error", "Failed to create resource", "destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #fff, #f1f5f9)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      dark: {
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
      }
    }}>
      <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #4f46e5, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Resource Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Streamline your resource management with modern efficiency
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{
            maxWidth: '20rem',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.75rem',
            padding: '0.375rem',
            gap: '0.375rem'
          }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: activeTab === 'create' ? '#fff' : 'transparent',
                color: activeTab === 'create' ? '#4f46e5' : '#4b5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Create
            </button>
            <button
              onClick={() => setActiveTab('view')}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: activeTab === 'view' ? '#fff' : 'transparent',
                color: activeTab === 'view' ? '#4f46e5' : '#4b5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              View
            </button>
          </div>

          {activeTab === 'create' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #fff, #f8fafc)',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                width: '100%'
              }}>
                <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Resource Name</label>
                    <input
                      type="text"
                      value={newResource.name}
                      onChange={e => setNewResource({...newResource, name: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Environment</label>
                    <select
                      value={newResource.environment}
                      onChange={e => setNewResource({...newResource, environment: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                    >
                      <option value="">Select Environment</option>
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                      <option value="Development">Development</option>
                      <option value="Terraform">Terraform</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Source</label>
                    <input
                      type="text"
                      value={newResource.source}
                      onChange={e => setNewResource({...newResource, source: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Owner Email</label>
                    <input
                      type="email"
                      value={newResource.owner}
                      onChange={e => setNewResource({...newResource, owner: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '1rem'
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Resource'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #fff, #f8fafc)',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '2rem'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Environment</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Source</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '0.75rem' }}>{resource.name}</td>
                          <td style={{ padding: '0.75rem' }}>{resource.environment}</td>
                          <td style={{ padding: '0.75rem' }}>{resource.source}</td>
                          <td style={{ padding: '0.75rem' }}>{resource.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: toast.variant === 'destructive' ? '#fee2e2' : '#dcfce7',
            color: toast.variant === 'destructive' ? '#991b1b' : '#166534',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div>
              <h3 style={{ fontWeight: '600' }}>{toast.title}</h3>
              <p style={{ fontSize: '0.875rem' }}>{toast.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


