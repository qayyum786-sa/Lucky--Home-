import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'user' };

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // {id, name}

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll();
      setUsers(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditUser(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    if (!editUser && !form.password) { setError('Password is required for new users.'); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;

      if (editUser) {
        await usersAPI.update(editUser.id, payload);
      } else {
        payload.password = form.password;
        await usersAPI.create(payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (user) => {
    if (user.id === currentUser?.id) return; // can't delete yourself
    setDeleteConfirm(user);
  };

  const handleDeleteConfirm = async () => {
    try {
      await usersAPI.remove(deleteConfirm.id);
      setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} users registered</p>
        </div>
        <button onClick={openCreate} className="btn-gold text-xs py-2.5 px-5">＋ Add User</button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">#</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Name</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Email</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Role</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Joined</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
              ))
            ) : users.map((u, idx) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-600 font-bold text-sm flex-shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-dark-800 text-sm">{u.name}</p>
                      {u.id === currentUser?.id && <p className="text-gold-500 text-xs">You</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 capitalize ${u.role === 'admin' ? 'bg-gold-500/20 text-gold-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 hover:bg-blue-50 transition-colors">Edit</button>
                    <button
                      onClick={() => handleDeleteRequest(u)}
                      disabled={u.id === currentUser?.id}
                      className="text-xs border border-red-200 text-red-500 px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-100 flex items-center justify-center flex-shrink-0 text-xl">🗑️</div>
              <div>
                <h3 className="font-display font-bold text-dark-800 text-lg">Delete User?</h3>
                <p className="text-gray-600 text-sm mt-1">Delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-sm uppercase tracking-widest transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 text-sm uppercase tracking-widest">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-dark-800">{editUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>}
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field text-sm" placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field text-sm" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">
                  Password {editUser && <span className="text-gray-400 font-normal normal-case">(leave blank to keep current)</span>}
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field text-sm">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold py-3 px-6 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
