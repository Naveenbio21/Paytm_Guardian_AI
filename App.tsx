/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Send, History, Brain, BarChart3, Mic, Bell, BellOff,
  User, Menu, X, ShieldAlert, Settings, PhoneCall, Zap,
  LogOut, Shield, Info, CreditCard as CardIcon, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE IMPORTS ---
import { db } from './lib/firebase';
import { 
  collection, query, onSnapshot, orderBy, addDoc, 
  doc, updateDoc, setDoc 
} from 'firebase/firestore';

import { Transaction, UserProfile, RiskFactors, BlockedAttempt } from './lib/types';
import Dashboard from './components/Dashboard';
import WalletScreen from './components/Wallet';
import SendMoney from './components/SendMoney';
import AIInsights from './components/AIInsights';
import BusinessAnalytics from './components/BusinessAnalytics';
import VoiceAssistant from './components/VoiceAssistant';
import Recharge from './components/Recharge';
import CreditCard from './components/CreditCard';
import SyncGateway from './components/SyncGateway';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'send' | 'ai' | 'business' | 'voice' | 'recharge' | 'cards'>('home');
  const [isSynced, setIsSynced] = useState(false);
  
  // --- LIVE DATA STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [blockedAttempts, setBlockedAttempts] = useState<BlockedAttempt[]>([]);
  
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [riskFactors, setRiskFactors] = useState<RiskFactors>({
    isOnCall: false,
    behaviorAnomaly: false,
    vpaRisk: 'LOW'
  });
  const [initialPayment, setInitialPayment] = useState<{ amount: number, recipient: string } | null>(null);

  // --- REAL-TIME FIRESTORE SYNC ---
  useEffect(() => {
    if (!isSynced) return;

    const userRef = doc(db, 'users', 'naveen_user');
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data() as UserProfile);
      } else {
        setDoc(userRef, {
          name: 'Naveen Chandrasekar',
          balance: 15420.50,
          upiId: 'naveen@okaxis',
          phone: '9876543210'
        });
      }
    });

    const qTxns = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    const unsubTxns = onSnapshot(qTxns, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });

    const qBlocked = query(collection(db, 'blocked_attempts'), orderBy('timestamp', 'desc'));
    const unsubBlocked = onSnapshot(qBlocked, (snapshot) => {
      setBlockedAttempts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlockedAttempt)));
    });

    return () => { unsubUser(); unsubTxns(); unsubBlocked(); };
  }, [isSynced]);

  // --- HANDLERS ---
  const addTransaction = async (txn: Transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), { ...txn, timestamp: new Date().toISOString() });
      if (user) {
        const userRef = doc(db, 'users', 'naveen_user');
        const newBalance = txn.type === 'debit' ? user.balance - txn.amount : user.balance + txn.amount;
        await updateDoc(userRef, { balance: newBalance });
      }
    } catch (e) {
      addNotification("Payment failed. Check AI Connection.");
    }
  };

  const addNotification = (text: string) => {
    if (!notificationsEnabled) return;
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const renderContent = () => {
    if (!user) return <div className="flex items-center justify-center h-full">Connecting to Guardian AI...</div>;

    switch (activeTab) {
      case 'home': return <Dashboard user={user} transactions={transactions} onNavigate={setActiveTab} blockedAttempts={blockedAttempts} />;
      case 'wallet': return <WalletScreen user={user} transactions={transactions} onBack={() => setActiveTab('home')} />;
      case 'send': return (
        <SendMoney 
          user={user} transactions={transactions} 
          onSend={(txn) => { addTransaction(txn); setInitialPayment(null); }} 
          onBack={() => { setActiveTab('home'); setInitialPayment(null); }} 
          onNotify={addNotification} riskFactors={riskFactors}
          onBlock={async (attempt) => {
            await addDoc(collection(db, 'blocked_attempts'), { ...attempt, timestamp: new Date().toISOString() });
            addNotification(`🛡️ Guardian AI blocked risky payment to ${attempt.recipient}`);
          }}
          initialAmount={initialPayment?.amount} initialRecipient={initialPayment?.recipient}
        />
      );
      case 'ai': return <AIInsights transactions={transactions} onBack={() => setActiveTab('home')} />;
      case 'business': return <BusinessAnalytics onBack={() => setActiveTab('home')} />;
      case 'voice': return (
        <VoiceAssistant 
          onBack={() => setActiveTab('home')} 
          onPaymentRequest={(amount, recipient) => { setInitialPayment({ amount, recipient }); setActiveTab('send'); }}
          onRechargeRequest={() => setActiveTab('recharge')}
          onCCRequest={() => setActiveTab('cards')}
        />
      );
      case 'recharge': return <Recharge onBack={() => setActiveTab('home')} onRecharge={(amt, num) => addTransaction({
        id: `RCH${Date.now()}`, amount: amt, type: 'debit', category: 'Bills', recipient: `Recharge: ${num}`, timestamp: '', status: 'completed'
      })} />;
      case 'cards': return <CreditCard onBack={() => setActiveTab('home')} onPayBill={(amt, card) => addTransaction({
        id: `CC${Date.now()}`, amount: amt, type: 'debit', category: 'Bills', recipient: `CC Bill: ${card}`, timestamp: '', status: 'completed'
      })} />;
      default: return <Dashboard user={user} transactions={transactions} onNavigate={setActiveTab} blockedAttempts={blockedAttempts} />;
    }
  };

  if (!isSynced) return <SyncGateway onSyncComplete={() => setIsSynced(true)} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden border-x border-slate-200">
      
      {/* Toast Notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[340px] pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id} initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 pointer-events-auto"
            >
              <ShieldAlert size={18} className="text-blue-400 shrink-0" />
              <p className="text-sm font-medium">{n.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-[60] shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-90"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Guardian AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(true); }}
            className="p-2 bg-blue-500 hover:bg-blue-400 rounded-full transition-all active:rotate-45"
          >
            <Settings size={20} />
          </button>
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className="p-2">
            {notificationsEnabled ? <Bell size={22} /> : <BellOff size={22} className="text-white/50" />}
          </button>
        </div>
      </header>

      {/* Main UI */}
      <main className="flex-1 overflow-y-auto pb-24 bg-slate-50">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation (Paytm Style) */}
      <nav className="bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-3 flex justify-around items-center fixed bottom-0 w-full max-w-md z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Wallet size={20} />} label="Home" />
        <NavButton active={activeTab === 'send'} onClick={() => setActiveTab('send')} icon={<Send size={20} />} label="Pay" />
        <div className="relative -top-6">
           <button 
             onClick={() => setActiveTab('ai')}
             className={cn(
               "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
               activeTab === 'ai' ? "bg-blue-600 text-white scale-110 rotate-[360deg]" : "bg-white text-blue-600 border-2 border-blue-600"
             )}
           >
             <Brain size={28} />
           </button>
           <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 uppercase">Coach</span>
        </div>
        <NavButton active={activeTab === 'business'} onClick={() => setActiveTab('business')} icon={<BarChart3 size={20} />} label="Stats" />
        <NavButton active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} icon={<Mic size={20} />} label="Voice" />
      </nav>

      {/* Side Menu Drawer (Paytm Style) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-[80] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="bg-blue-600 p-6 text-white">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                    {user?.name.charAt(0)}
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={24} /></button>
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-sm opacity-80">{user?.upiId}</p>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <MenuLink icon={<Shield className="text-green-500" />} label="Security Shield" sub="AI Protection Active" onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }} />
                <MenuLink icon={<History className="text-blue-500" />} label="Order History" sub="View all transactions" onClick={() => { setActiveTab('wallet'); setIsMenuOpen(false); }} />
                <MenuLink icon={<CardIcon className="text-purple-500" />} label="Saved Cards" sub="Manage your payments" onClick={() => { setActiveTab('cards'); setIsMenuOpen(false); }} />
                <hr className="my-4 border-slate-100" />
                <MenuLink icon={<Info className="text-slate-400" />} label="Help & Support" sub="24x7 Assistant" />
              </div>

              <div className="p-4 border-t border-slate-100">
                <button className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Bottom Sheet (Simulation Panel) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white z-[80] rounded-t-[32px] p-6 shadow-2xl border-t border-slate-100"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Simulation Control</h2>
                  <p className="text-sm text-slate-500">Test Guardian AI risk engine</p>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="space-y-4 mb-8">
                <SimulationToggle 
                  icon={<PhoneCall className={riskFactors.isOnCall ? "text-red-500" : "text-slate-400"} />}
                  label="Simulate Active Call" 
                  active={riskFactors.isOnCall} 
                  onToggle={() => setRiskFactors(p => ({...p, isOnCall: !p.isOnCall}))} 
                />
                
                <SimulationToggle 
                  icon={<Zap className={riskFactors.behaviorAnomaly ? "text-orange-500" : "text-slate-400"} />}
                  label="Simulate Behavior Anomaly" 
                  active={riskFactors.behaviorAnomaly} 
                  onToggle={() => setRiskFactors(p => ({...p, behaviorAnomaly: !p.behaviorAnomaly}))} 
                />

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className={cn(riskFactors.vpaRisk === 'HIGH' ? "text-red-500" : "text-slate-400")} />
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Target VPA Risk</span>
                  </div>
                  <select 
                    value={riskFactors.vpaRisk}
                    onChange={(e) => setRiskFactors(p => ({...p, vpaRisk: e.target.value as any}))}
                    className="bg-white border-2 border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MED</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
              >
                Apply Simulation
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SimulationToggle({ icon, label, active, onToggle }: { icon: React.ReactNode, label: string, active: boolean, onToggle: () => void }) {
  return (
    <div className={cn("p-4 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer", active ? "bg-white border-blue-600 shadow-md" : "bg-slate-50 border-transparent")} onClick={onToggle}>
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-xl", active ? "bg-blue-50 text-blue-600" : "bg-white text-slate-400")}>{icon}</div>
        <span className={cn("font-bold text-sm", active ? "text-blue-900" : "text-slate-600")}>{label}</span>
      </div>
      <div className={cn("w-12 h-6 rounded-full transition-all relative", active ? "bg-blue-600" : "bg-slate-300")}>
        <motion.div 
          animate={{ x: active ? 24 : 2 }} 
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}

function MenuLink({ icon, label, sub, onClick }: { icon: React.ReactNode, label: string, sub?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group active:bg-blue-50">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 group-hover:bg-white rounded-xl transition-colors">{icon}</div>
        <div className="text-left">
          <p className="font-bold text-slate-900 text-sm">{label}</p>
          {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300", active ? "text-blue-600" : "text-slate-400 hover:text-slate-600")}>
      <div className={cn("transition-transform", active && "scale-110")}>{icon}</div>
      <span className={cn("text-[10px] font-bold uppercase tracking-widest", active ? "opacity-100" : "opacity-60")}>{label}</span>
    </button>
  );
}