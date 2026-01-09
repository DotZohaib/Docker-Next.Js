"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Users, DollarSign, Briefcase, 
  LayoutGrid, ArrowUpRight, LucideIcon 
} from "lucide-react";

// ✅ 1. User ka Type define kiya (TypeScript Zaroorat)
interface User {
  id: number;
  name: string;
  department: string;
  salary: number;
  role: string;
}

// ✅ 2. API Response ka Type
interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: User[];
  users?: User[]; // Fallback ke liye
  totalUsers?: number;
  createdBy?: string;
}

export default function Home() {
  // ✅ 3. useState ko bataya ke ismein 'User' ka array hoga
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = await fetch("https://dotzohaibapi.vercel.app");
        const res: ApiResponse = await api.json();
        
        // Backend data structure handle karna
        if (res.success && res.data) {
          setUsers(res.data);
        } else if (res.users) {
          setUsers(res.users);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- ADVANCED LOGIC ---

  // Get Unique Departments
  const departments = ["All", ...Array.from(new Set(users.map(u => u.department)))];

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || user.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Live Stats Calculation
  const totalSalary = filteredUsers.reduce((acc, curr) => acc + curr.salary, 0);
  const avgSalary = filteredUsers.length > 0 ? Math.round(totalSalary / filteredUsers.length) : 0;

  // Dynamic Colors for Departments (Type 'any' use kiya safe side ke liye)
  const getDeptStyle = (dept: string): string => {
    const styles: Record<string, string> = {
      IT: "bg-blue-100 text-blue-700 border-blue-200",
      HR: "bg-rose-100 text-rose-700 border-rose-200",
      Finance: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Marketing: "bg-purple-100 text-purple-700 border-purple-200",
      Sales: "bg-amber-100 text-amber-700 border-amber-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return styles[dept] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Team Portal</h1>
                <p className="text-xs text-slate-500 font-medium">MANAGEMENT SYSTEM</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-slate-50 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search employee name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* --- STATS ROW --- */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <StatCard label="Total Employees" value={filteredUsers.length} icon={Users} color="blue" />
              <StatCard label="Avg. Salary" value={`$${avgSalary.toLocaleString()}`} icon={DollarSign} color="green" />
              <StatCard label="Departments" value={departments.length - 1} icon={Briefcase} color="purple" />
              <StatCard label="Active Status" value="Online" icon={ArrowUpRight} color="emerald" />
            </div>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                selectedDept === dept
                  ? "bg-slate-800 text-white border-slate-800 shadow-md transform scale-105"
                  : "bg-white text-slate-600 border-gray-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* User Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 ${getDeptStyle(user.department).split(" ")[0].replace("bg-", "bg-gradient-to-r from-white to-")}`}></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random&bold=true&color=fff`} 
                      alt={user.name}
                      className="w-14 h-14 rounded-full border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getDeptStyle(user.department)}`}>
                    {user.department}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {user.role}
                  </p>
                </div>

                <div className="h-px bg-slate-100 my-4 group-hover:bg-slate-200 transition-colors"></div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Salary</span>
                    <div className="flex items-center text-slate-700 font-bold">
                      <span className="text-sm text-slate-400 mr-0.5">$</span>
                      {user.salary.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">ID</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      #{user.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-3">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No employees found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedDept("All");}}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ✅ 4. StatCard Props ki Type define ki
interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3 hover:bg-white hover:shadow-md transition-all">
    {/* Note: Tailwind mein dynamic classes kabhi kabhi production mein gayab ho sakti hain. 
        Safest way 'clsx' library use karna hai, lekin abhi ke liye ye chalega */}
    <div className={`p-2.5 rounded-lg bg-${color}-100 text-${color}-600`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);