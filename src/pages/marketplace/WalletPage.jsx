import React, { useState, useEffect } from 'react';
import { 
  Wallet, Plus, History, ArrowUpRight, ArrowDownLeft, 
  ShieldCheck, CreditCard, Landmark, Wallet2 
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { API_BASE_URL } from '../../api/config';

const WalletPage = () => {
  const { userData } = useProfile();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState(100);
  const [isToppingUp, setIsToppingUp] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      fetchBalance();
    }
  }, [userData]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/wallet/balance/${userData.id}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async () => {
    setIsToppingUp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/wallet/topup?user_id=${userData.id}&amount=${topupAmount}`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.new_balance);
        alert(`Success! ₹${topupAmount} added to your wallet.`);
      }
    } catch (error) {
      console.error("Topup error:", error);
    } finally {
      setIsToppingUp(false);
    }
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">My <span className="text-indigo-600">Wallet</span></h1>
        <p className="text-slate-500">Manage your balance and consultation payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden h-full">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/80 font-bold uppercase text-[10px] tracking-widest mb-2">
                  <Wallet2 className="w-4 h-4" />
                  Available Balance
                </div>
                <div className="text-6xl font-black mb-1">
                  ₹{loading ? '...' : balance.toLocaleString()}
                </div>
                <div className="text-indigo-200 text-sm font-bold">
                  Good for approx. {Math.floor(balance / 20)} mins of consultation
                </div>
              </div>

              <div className="mt-12 bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-300" />
                <span className="text-xs font-bold leading-tight">Your funds are safe and 100% refundable for failed sessions.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-up Options */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Add Money to Wallet</h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setTopupAmount(amount)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all border ${
                    topupAmount === amount 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
              <input 
                type="number" 
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                placeholder="Enter custom amount"
                className="w-full pl-8 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-xl"
              />
            </div>

            <button 
              onClick={handleTopup}
              disabled={isToppingUp}
              className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
            >
              {isToppingUp ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </>
              )}
            </button>

            <div className="mt-8 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2 grayscale opacity-50">
                <CreditCard className="w-5 h-5" />
                <Landmark className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Placeholder */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Recent Transactions</h2>
          <button className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <History className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden">
          <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-slate-900">Wallet Top-up</div>
                <div className="text-xs text-slate-400 font-bold">25 Apr 2024 • 02:30 PM</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-green-600 text-lg">+₹500</div>
              <div className="text-[10px] font-black uppercase text-green-600/50 tracking-widest">Success</div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-slate-900">Consultation with Acharya Rahul</div>
                <div className="text-xs text-slate-400 font-bold">24 Apr 2024 • 11:15 AM</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-red-600 text-lg">-₹125</div>
              <div className="text-[10px] font-black uppercase text-red-600/50 tracking-widest">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
