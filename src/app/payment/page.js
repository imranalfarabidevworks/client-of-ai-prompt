"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiSparklingFill, RiCheckLine, RiLockFill, RiShieldCheckFill,
  RiArrowLeftLine, RiLoader4Line,
} from "react-icons/ri";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const BENEFITS = [
  "Access all private & premium prompts",
  "Unlimited prompt copies",
  "Priority prompt submission",
  "Exclusive creator-only prompts",
  "Early access to new features",
  "Premium badge on your profile",
];

export default function PaymentPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [success, setSuccess] = useState(false);

  const formatCard = (v) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v) => v.replace(/\D/g, "").replace(/^(\d{2})/, "$1/").slice(0, 5);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!card.name || !card.number || !card.expiry || !card.cvc)
      return toast.error("Fill in all payment details");
    setLoading(true);
    try {
      // Simulate payment → in production use Stripe.js
      await new Promise((r) => setTimeout(r, 2000));

      // Notify backend
      await api.post("/api/payment/success", {
        transactionId: "txn_" + Date.now(),
        amount: 5,
      }).catch(() => {});

      // Update local user state immediately
      updateUser({ isPremium: true });

      setSuccess(true);
      toast.success("Payment successful! Premium activated 🎉");
      setTimeout(() => router.push("/dashboard/profile"), 2500);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <PrivateRoute>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <RiCheckLine className="text-green-600 text-2xl" />
          </div>
          <h2 className="font-bold text-xl text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm mb-1">You're now a Premium member ✨</p>
          <p className="text-xs text-gray-400">Redirecting to your profile...</p>
        </motion.div>
      </div>
      <Footer />
    </PrivateRoute>
  );

  if (user?.isPremium) return (
    <PrivateRoute>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <RiSparklingFill className="text-white text-2xl" />
          </div>
          <h2 className="font-bold text-xl text-gray-900 mb-2">You're already Premium!</h2>
          <p className="text-gray-500 text-sm mb-5">Enjoy unlimited access to all private prompts.</p>
          <button onClick={() => router.push("/prompts")} className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">Browse Prompts</button>
        </div>
      </div>
      <Footer />
    </PrivateRoute>
  );

  return (
    <PrivateRoute>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <RiArrowLeftLine /> Go back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">One-time payment</span>
                <h1 className="font-bold text-3xl text-gray-900 mt-3 mb-2">PromptHive Premium</h1>
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-extrabold text-5xl text-blue-600">$5</span>
                  <span className="text-gray-500 pb-1">one time · lifetime access</span>
                </div>
                <p className="text-gray-500 text-sm">No subscriptions, no renewals. One payment, permanent access.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <p className="font-semibold text-sm text-gray-900">What's included:</p>
                {BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <RiCheckLine className="text-blue-600 text-xs" />
                    </span>
                    <span className="text-sm text-gray-700">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RiShieldCheckFill className="text-green-500 text-base" />
                Secured by Stripe · SSL encrypted · No card stored
              </div>
            </motion.div>

            {/* Payment form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                <RiLockFill className="text-blue-500" /> Payment Details
              </h2>

              <form onSubmit={handlePay} className="space-y-4">
                {[
                  { key: "name", label: "Cardholder Name", placeholder: "John Doe", type: "text" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type={type} value={card[key]} onChange={(e) => setCard((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                  <input value={card.number} onChange={(e) => setCard((p) => ({ ...p, number: formatCard(e.target.value) }))} placeholder="4242 4242 4242 4242" maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                    <input value={card.expiry} onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY" maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                    <input value={card.cvc} onChange={(e) => setCard((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500"><span>PromptHive Premium</span><span>$5.00</span></div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>$5.00</span></div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                  {loading ? <><RiLoader4Line className="animate-spin" /> Processing…</> : <><RiLockFill /> Pay $5.00 — Unlock Premium</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </PrivateRoute>
  );
}
