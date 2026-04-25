import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, Phone, Video, Star, Languages, 
  GraduationCap, Clock, Filter, Search, ShieldCheck 
} from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const AstrologerList = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const specializations = ["All", "Vedic", "Nadi", "Numerology", "Vastu", "Palmistry", "Matchmaking"];

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/astrologers`);
      if (response.ok) {
        const data = await response.json();
        setAstrologers(data);
      }
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAstrologers = astrologers.filter(astro => {
    const matchesSearch = astro.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialization === 'All' || astro.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Consult Top <span className="text-indigo-600">Astrologers</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get real-time guidance from verified experts. First 5 minutes are on us for your first session!
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar">
          {specializations.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedSpecialization === spec 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 bg-slate-50 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAstrologers.map(astro => (
            <div 
              key={astro.id} 
              className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex gap-5 mb-6">
                <div className="relative shrink-0">
                  <img 
                    src={astro.photo_url} 
                    alt={astro.full_name} 
                    className="w-24 h-24 rounded-2xl object-cover shadow-inner"
                  />
                  {astro.is_online && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-900 truncate">{astro.full_name}</h3>
                    {astro.is_verified && <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    {astro.rating_avg} <span className="text-slate-400 font-medium">({astro.rating_count})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {astro.specializations.slice(0, 2).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-md tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Languages className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">{astro.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">{astro.experience_years} Years Experience</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">₹{astro.price_per_min}/min</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/chat/new?astrologerId=${astro.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <button 
                  className="px-4 py-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button 
                  className="px-4 py-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredAstrologers.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No astrologers found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default AstrologerList;
