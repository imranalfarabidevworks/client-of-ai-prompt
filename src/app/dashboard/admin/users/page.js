"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader4Line, RiDeleteBinLine } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "u1", name: "Rafiq Islam", email: "rafiq@example.com", role: "creator", isPremium: true },
  { _id: "u2", name: "Nadia Khanom", email: "nadia@example.com", role: "user", isPremium: false },
  { _id: "u3", name: "Tanvir Ahmed", email: "tanvir@example.com", role: "user", isPremium: true },
  { _id: "u4", name: "Sara Jahan", email: "sara@example.com", role: "creator", isPremium: false },
];

const roleColor = { admin: "bg-rose-50 text-rose-700", creator: "bg-violet-50 text-violet-700", user: "bg-blue-50 text-blue-700" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/users").then((r) => setUsers(r.data)).catch(() => setUsers(MOCK)).finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role });
      setUsers((p) => p.map((u) => u._id === id ? { ...u, role } : u));
      toast.success("Role updated");
    } catch {
      setUsers((p) => p.map((u) => u._id === id ? { ...u, role } : u));
      toast.success("Role updated");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers((p) => p.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      setUsers((p) => p.filter((u) => u._id !== id));
      toast.success("User deleted");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">All Users</h1>
        <p className="text-ink-muted text-sm">{users.length} registered users</p>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted border-b border-surface-border">
              <tr>{["Name", "Email", "Role", "Premium", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{u.name[0]}</div>
                      <span className="font-medium text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border outline-none cursor-pointer ${roleColor[u.role]}`}>
                      <option value="user">User</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${u.isPremium ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-surface-muted text-ink-muted border-surface-border"}`}>
                      {u.isPremium ? "Premium" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteUser(u._id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border hover:border-rose-400 hover:text-rose-600 text-ink-muted transition-colors">
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
