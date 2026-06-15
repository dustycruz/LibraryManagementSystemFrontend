import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUsers, deactivateUser, getRoles, updateUser } from '../api/usersApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', isActive: true, roleIds: [] });
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
        if (!cancelled) {
          setUsers(usersRes.data.data);
          setRoles(rolesRes.data.data);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await deactivateUser(id);
      toast.success('User deactivated.');
      setRefreshKey(k => k + 1);
    } catch {
      toast.error('Failed to deactivate user.');
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roleIds: roles.filter(r => user.roles.includes(r.roleName)).map(r => r.roleId),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(editUser.userId, editForm);
      toast.success('User updated.');
      setEditUser(null);
      setRefreshKey(k => k + 1);
    } catch {
      toast.error('Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleId) => {
    setEditForm(f => ({
      ...f,
      roleIds: f.roleIds.includes(roleId)
        ? f.roleIds.filter(r => r !== roleId)
        : [...f.roleIds, roleId],
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#003f7f', marginBottom: '8px' }}>
          👥 User Management
        </h1>
        <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
          Manage library system users and their permissions
        </p>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafb' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Roles</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Joined</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#003f7f', borderBottom: '2px solid #e8eaed' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.userId}
                  style={{ borderBottom: '1px solid #e8eaed', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 63, 127, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.fullName}</td>
                  <td style={{ padding: '14px 16px', color: '#6c757d', fontSize: '14px' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {u.roles.map(r => (
                        <span
                          key={r}
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: r === 'Admin' ? '#8b5cf6' : r === 'Librarian' ? '#06b6d4' : '#10b981',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        backgroundColor: u.isActive ? '#10b981' : '#6c757d',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6c757d', fontSize: '14px' }}>{formatDate(u.createdAt)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => openEdit(u)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          color: '#003f7f',
                          border: '1px solid #003f7f',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#003f7f';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#003f7f';
                        }}
                      >
                        Edit
                      </button>
                      {u.isActive && (
                        <button
                          onClick={() => handleDeactivate(u.userId)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                            e.target.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#ef4444';
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setEditUser(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 63, 127, 0.15)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e8eaed',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003f7f', margin: 0 }}>
                Edit User: {editUser.email}
              </h2>
              <button
                onClick={() => setEditUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6c757d',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#003f7f', marginBottom: '8px' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #e8eaed',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#003f7f')}
                  onBlur={(e) => (e.target.style.borderColor = '#e8eaed')}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#003f7f', marginBottom: '8px' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '1px solid #e8eaed',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#003f7f')}
                  onBlur={(e) => (e.target.style.borderColor = '#e8eaed')}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#003f7f', marginBottom: '12px' }}>
                  Roles
                </label>
                {roles.map(r => (
                  <div key={r.roleId} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id={`role-${r.roleId}`}
                      checked={editForm.roleIds.includes(r.roleId)}
                      onChange={() => toggleRole(r.roleId)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#003f7f',
                      }}
                    />
                    <label
                      htmlFor={`role-${r.roleId}`}
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1a1a1a',
                        cursor: 'pointer',
                      }}
                    >
                      {r.roleName}
                    </label>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(f => ({ ...f, isActive: e.target.checked }))}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#003f7f',
                  }}
                />
                <label
                  htmlFor="isActive"
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#003f7f',
                    cursor: 'pointer',
                  }}
                >
                  Active User
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e8eaed',
                backgroundColor: '#fafbfc',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setEditUser(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid #e8eaed',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafb';
                  e.target.style.borderColor = '#6c757d';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#e8eaed';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#003f7f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#0052a3')}
                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#003f7f')}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
