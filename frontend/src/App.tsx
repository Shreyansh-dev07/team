import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Tricolor Ribbon */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600 w-full" />

      {/* Top Banner */}
      <header className="bg-[#092746] text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f3e6d] border border-amber-500 flex items-center justify-center font-bold text-amber-500 text-xl">
              🏛️
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Sudhaar<span className="text-amber-500">Setu</span>
              </h1>
              <p className="text-xs text-slate-300">Kanpur Civic Grievance Management Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <a href="index.html" className="px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition">Home</a>
            <a href="report.html" className="px-3 py-1.5 rounded text-sm font-medium bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">Report Issue</a>
            <a href="track.html" className="px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition">Track Status</a>
            <a href="map.html" className="px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition">Issues Map</a>
            <a href="dashboard.html" className="px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition">Dashboard</a>
            <a href="admin.html" className="px-3 py-1.5 rounded text-sm font-medium text-amber-300 hover:bg-white/10 transition">Dept Login</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="bg-gradient-to-br from-[#092746] to-[#071e33] text-white rounded-2xl p-8 mb-8 shadow-xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
            Citizen-First Civic Redressal • Kanpur, UP
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Together, Let&apos;s Build a <span className="text-amber-500">Better Kanpur</span>
          </h2>
          <p className="text-slate-300 max-w-xl text-base md:text-lg mb-6">
            Report civic problems, share their location, and track their resolution across all municipal divisions of Kanpur.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="report.html" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg transition">
              📝 Report a Problem
            </a>
            <a href="track.html" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition">
              🔍 Track Complaint
            </a>
            <a href="map.html" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition">
              🗺️ Kanpur Issues Map
            </a>
          </div>
        </div>

        {/* Quick Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">🚧</div>
            <h3 className="font-bold text-lg text-[#0f3e6d] mb-1">Roads & Potholes</h3>
            <p className="text-sm text-slate-600 mb-4">Routes directly to Public Works Department (PWD-ROAD) for cold patch resurfacing.</p>
            <a href="report.html?category=pothole" className="text-sm font-semibold text-amber-600 hover:underline">Report Pothole &rarr;</a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-bold text-lg text-[#0f3e6d] mb-1">Sanitation & Garbage</h3>
            <p className="text-sm text-slate-600 mb-4">Routes to Solid Waste Management (SWM-SAN) with 24-hour compactor dispatch SLA.</p>
            <a href="report.html?category=garbage" className="text-sm font-semibold text-amber-600 hover:underline">Report Garbage &rarr;</a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold text-lg text-[#0f3e6d] mb-1">Streetlights & Electrical</h3>
            <p className="text-sm text-slate-600 mb-4">Dark streets & non-working LED lights routed to Junior Engineer Electrical.</p>
            <a href="report.html?category=streetlight" className="text-sm font-semibold text-amber-600 hover:underline">Report Streetlight &rarr;</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#071e33] text-slate-400 py-6 px-6 border-t-4 border-amber-500 text-center text-sm">
        <p>&copy; 2026 SudhaarSetu &bull; Kanpur Nagar Civic Redressal Portal</p>
      </footer>
    </div>
  );
}
