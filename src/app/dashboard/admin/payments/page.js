"use client";
import { useState, useEffect } from "react";
import { RiLoader4Line, RiMoneyDollarCircleLine } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "p1", email: "rafiq@example.com", transactionId: "txn_3PQa8X2eZvKYlo2C", amount: 5, date: "2025-05-10", status: "success" },
  { _id: "p2", email: "nadia@example.com", transactionId: "txn_3PQa8X2eZvKYlo2D", amount: 5, date: "2025-05-08", status: "success" },
  { _id: "p3", email: "tanvir@example.com", transactionId: "txn_3PQa8X2eZvKYlo2E", amount: 5, date: "2025-05-06", status: "success" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/payments").then((r) => setPayments(r.data)).catch(() => setPayments(MOCK)).finally(() => setLoading(false));
  }, []);

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink mb-1">All Payments</h1>
          <p className="text-ink-muted text-sm">{payments.length} transactions</p>
        </div>
        <div className="card px-5 py-3 flex items-center gap-2">
          <RiMoneyDollarCircleLine className="text-emerald-500 text-xl" />
          <div>
            <p className="text-xs text-ink-muted">Total Revenue</p>
            <p className="font-display font-bold text-lg text-ink">${total}.00</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted border-b border-surface-border">
              <tr>{["Email", "Transaction ID", "Amount", "Date", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-4 py-3 text-ink">{p.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-muted">{p.transactionId}</td>
                  <td className="px-4 py-3 font-semibold text-ink">${p.amount}.00</td>
                  <td className="px-4 py-3 text-ink-muted">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 capitalize">{p.status}</span>
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
