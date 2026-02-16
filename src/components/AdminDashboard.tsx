import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Package, 
  MessageSquare, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  ClipboardList,
  Receipt,
  CreditCard,
  Banknote,
  Download,
  Filter,
  MapPin,
  BarChart3,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  LayoutDashboard,
  FileText,
  AlertCircle,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  PackageOpen,
  Layers,
  AlertTriangle,
  Plus,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import Header from './Header';
import BackButton from './BackButton';
import { Button } from './ui/button';
import type { User } from '../types';
import InventoryWidgets from './admin/InventoryWidgets';
import InventoryDashboard from './admin/InventoryDashboard';
import PendingApprovalsList from './admin/PendingApprovalsList';
import InventoryStockLevels from './admin/InventoryStockLevels';
import LowStockAlerts from './admin/LowStockAlerts';
import ServiceTypeConfiguration from './admin/ServiceTypeConfiguration';
import RecordMaterialUsageModal from './admin/RecordMaterialUsageModal';
import { StaffManagement } from './admin/StaffManagement';
import { ReviewsManagement } from './admin/ReviewsManagement';
import { ComplaintsManagement } from './admin/ComplaintsManagement';
import { GPSTracking } from './admin/GPSTracking';
import { ReportsManagement } from './admin/ReportsManagement';
import { SystemSettings } from './admin/SystemSettings';
import { AdminManagement } from './admin/AdminManagement';
import { StaffAvailabilityManagement } from './admin/StaffAvailabilityManagement';
import { TaskReassignmentManagement } from './admin/TaskReassignmentManagement';
import logo from 'figma:asset/d0e24839a24076173960597a25c12b48f3330fdf.png';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onProfileClick?: () => void;
}

const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5000 },
  { month: 'Mar', revenue: 5800 },
  { month: 'Apr', revenue: 6400 },
  { month: 'May', revenue: 7200 },
  { month: 'Jun', revenue: 7900 },
  { month: 'Jul', revenue: 8500 },
];

const serviceData = [
  { name: 'Deep Cleaning', value: 35, color: '#7C3AED' },
  { name: 'Regular', value: 28, color: '#3B82F6' },
  { name: 'Laundry', value: 18, color: '#F59E0B' },
  { name: 'Sofa Cleaning', value: 12, color: '#D946EF' },
  { name: 'Other', value: 7, color: '#64748B' },
];

export default function AdminDashboard({ user, onLogout, theme }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [inventorySubTab, setInventorySubTab] = useState<'dashboard' | 'pending' | 'stock-levels' | 'low-stock' | 'config'>('dashboard');
  const [paymentAnalysisTab, setPaymentAnalysisTab] = useState<'service' | 'payment-type'>('service');

  const stats = {
    todayOrders: 42,
    todayCompleted: 28,
    todayCancelled: 4,
    todayPending: 10,
    todayRevenue: 125000,
  };

  const recentBookings = [
    { id: 'BK-1001', customer: 'Priya Silva', service: 'Home Cleaning', date: '2025-02-12', time: '10:00 AM', status: 'confirmed', amount: 4500 },
    { id: 'BK-1002', customer: 'Rajesh Kumar', service: 'Laundry Service', date: '2025-02-12', time: '02:00 PM', status: 'in-progress', amount: 1200 },
    { id: 'BK-1003', customer: 'Nimal Fernando', service: 'Sofa Cleaning', date: '2025-02-13', time: '09:00 AM', status: 'pending', amount: 3500 },
    { id: 'BK-1004', customer: 'Sarah Johnson', service: 'Deep Cleaning', date: '2025-02-13', time: '11:00 AM', status: 'confirmed', amount: 8000 },
    { id: 'BK-1005', customer: 'Ahmed Hassan', service: 'Office Cleaning', date: '2025-02-14', time: '08:00 AM', status: 'pending', amount: 5000 },
  ];

  const paymentRecords = [
    { id: 'PAY-1001', bookingId: 'BK-1001', customer: 'Priya Silva', service: 'Home Cleaning', amount: 4500, paymentMethod: 'Full Payment - Card', paymentStatus: 'completed', date: '2025-02-12', time: '10:30 AM', transactionId: 'TXN-4567890123' },
    { id: 'PAY-1002', bookingId: 'BK-1002', customer: 'Rajesh Kumar', service: 'Laundry Service', amount: 1200, paymentMethod: 'Cash on Delivery', paymentStatus: 'pending', date: '2025-02-12', time: '02:00 PM', transactionId: '-' },
    { id: 'PAY-1003', bookingId: 'BK-1003', customer: 'Nimal Fernando', service: 'Sofa Cleaning', amount: 3500, paymentMethod: 'Advance Payment (50%)', paymentStatus: 'partial', date: '2025-02-13', time: '09:15 AM', transactionId: 'TXN-4567890124' },
    { id: 'PAY-1004', bookingId: 'BK-1004', customer: 'Sarah Johnson', service: 'Deep Cleaning', amount: 8000, paymentMethod: 'Full Payment - Bank Transfer', paymentStatus: 'completed', date: '2025-02-13', time: '11:45 AM', transactionId: 'TXN-4567890125' },
    { id: 'PAY-1005', bookingId: 'BK-1005', customer: 'Ahmed Hassan', service: 'Office Cleaning', amount: 5000, paymentMethod: 'Pay After Completion', paymentStatus: 'scheduled', date: '2025-02-14', time: '08:00 AM', transactionId: '-' },
    { id: 'PAY-1006', bookingId: 'BK-1006', customer: 'Kumari Perera', service: 'Carpet Cleaning', amount: 6200, paymentMethod: 'Full Payment - Card', paymentStatus: 'completed', date: '2025-02-11', time: '03:20 PM', transactionId: 'TXN-4567890126' },
    { id: 'PAY-1007', bookingId: 'BK-1007', customer: 'David Chen', service: 'Window Cleaning', amount: 2800, paymentMethod: 'Advance + Balance', paymentStatus: 'partial', date: '2025-02-11', time: '01:10 PM', transactionId: 'TXN-4567890127' },
  ];

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'staff', name: 'Staff Management', icon: Users, subItems: [
      { id: 'staff-availability', name: 'Availability', icon: UserCheck },
      { id: 'task-reassignment', name: 'Reassignments', icon: RefreshCw },
    ]},
    { id: 'admin-mgmt', name: 'Admin Management', icon: ShieldCheck },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'inventory', name: 'Inventory Management', icon: PackageOpen },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'complaints', name: 'Complaints', icon: AlertCircle },
    { id: 'gps', name: 'GPS Tracking', icon: MapPin },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Today's Orders</h2>
        <p className="text-gray-500 text-sm mt-1">Summary of daily cleaning activities and revenue</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-50 p-2 rounded-lg"><ClipboardList className="w-5 h-5 text-purple-600" /></div>
            <span className="text-xs text-purple-600 font-medium">Today</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.todayOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-50 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <span className="text-xs text-green-600 font-medium">Success</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.todayCompleted}</div>
          <div className="text-sm text-gray-600">Complete Orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-50 p-2 rounded-lg"><XCircle className="w-5 h-5 text-red-600" /></div>
            <span className="text-xs text-red-600 font-medium">Dropped</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.todayCancelled}</div>
          <div className="text-sm text-gray-600">Cancelled Orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-amber-50 p-2 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
            <span className="text-xs text-amber-600 font-medium">Waiting</span>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.todayPending}</div>
          <div className="text-sm text-gray-600">Pending Orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-purple-700" /></div>
            <span className="text-xs text-purple-700 font-medium">Revenue</span>
          </div>
          <div className="text-2xl font-bold mb-1 text-purple-900">LKR {stats.todayRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} ticks={[0, 2500, 5000, 7500, 10000]} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Service Breakdown</h2>
          <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {serviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {serviceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
          <button className="text-purple-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-purple-600">{booking.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{booking.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{booking.service}</td>
                  <td className="px-4 py-4 text-sm text-gray-600"><div>{booking.date}</div><div className="text-xs text-gray-400">{booking.time}</div></td>
                  <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span></td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">LKR {booking.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryManagement = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'stock-levels', label: 'Stock Levels', icon: Layers },
      { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle, badge: 8, badgeColor: 'bg-red-500' },
      { id: 'config', label: 'Service Config', icon: Settings2 },
      { id: 'pending', label: 'Pending Approvals', icon: CheckCircle2, badge: 12, badgeColor: 'bg-amber-500' },
    ];
    return (
      <div className="space-y-6">
        <div className="bg-[#1e1534] rounded-3xl p-2 shadow-xl border border-white/5 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {navItems.map((item) => {
                const isActive = inventorySubTab === item.id;
                return (
                  <button key={item.id} onClick={() => setInventorySubTab(item.id as any)} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-200 shrink-0 group ${isActive ? 'bg-[#31255a] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'} transition-colors`} /><span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                    {item.badge && <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-white ${isActive ? 'bg-white/10' : item.badgeColor}`}>{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
            <div className="flex items-center gap-2 py-1">
              <Button variant="outline" className="h-10 px-4 gap-2 border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/5 hover:text-white shrink-0"><FileText className="w-4 h-4 text-purple-400" /><span className="hidden sm:inline">Report</span></Button>
              <Button className="h-10 px-4 gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-95 border-none shrink-0"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Item</span></Button>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {navItems.find(n => n.id === inventorySubTab)?.label || 'Inventory Management'}
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Cloud Laundry / Inventory / {inventorySubTab.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {inventorySubTab === 'dashboard' ? <InventoryDashboard /> : inventorySubTab === 'stock-levels' ? <InventoryStockLevels /> : inventorySubTab === 'low-stock' ? <LowStockAlerts /> : inventorySubTab === 'config' ? <ServiceTypeConfiguration /> : <PendingApprovalsList />}
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentRecords = () => {
    const totalRevenue = paymentRecords.reduce((sum, record) => sum + record.amount, 0);
    const completedPayments = paymentRecords.filter(p => p.paymentStatus === 'completed').length;
    const pendingPayments = paymentRecords.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'scheduled').length;
    const serviceAnalysis = paymentRecords.reduce((acc, record) => {
      const service = record.service;
      if (!acc[service]) acc[service] = { service, revenue: 0, count: 0 };
      acc[service].revenue += record.amount;
      acc[service].count += 1;
      return acc;
    }, {} as Record<string, { service: string; revenue: number; count: number }>);
    const serviceAnalysisData = Object.values(serviceAnalysis).sort((a, b) => b.revenue - a.revenue);
    const serviceChartData = serviceAnalysisData.map((item, index) => ({ name: item.service, value: item.revenue, color: ['#7C3AED', '#3B82F6', '#F59E0B', '#D946EF', '#10B981', '#64748B'][index % 6] }));
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500"><div className="flex items-center justify-between mb-2"><div className="bg-purple-50 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-purple-600" /></div><span className="text-xs text-purple-600 font-medium">Total</span></div><div className="text-2xl font-bold mb-1">LKR {totalRevenue.toLocaleString()}</div><div className="text-sm text-gray-600">Total Revenue</div></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500"><div className="flex items-center justify-between mb-2"><div className="bg-green-50 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div><span className="text-xs text-green-600 font-medium">Success</span></div><div className="text-2xl font-bold mb-1">{completedPayments}</div><div className="text-sm text-gray-600">Completed Payments</div></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-500"><div className="flex items-center justify-between mb-2"><div className="bg-amber-50 p-2 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div><span className="text-xs text-amber-600 font-medium">Pending</span></div><div className="text-2xl font-bold mb-1">{pendingPayments}</div><div className="text-sm text-gray-600">Pending Payments</div></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><Filter className="w-5 h-5 text-purple-600" /><h2 className="text-xl font-semibold text-gray-800">Payment Analysis</h2></div></div>
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            <button onClick={() => setPaymentAnalysisTab('service')} className={`px-4 py-2 border-b-2 transition-all font-medium text-sm ${paymentAnalysisTab === 'service' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>By Service</button>
            <button onClick={() => setPaymentAnalysisTab('payment-type')} className={`px-4 py-2 border-b-2 transition-all font-medium text-sm ${paymentAnalysisTab === 'payment-type' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>By Payment Type</button>
          </div>
          {paymentAnalysisTab === 'service' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div><h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue by Service</h3><div className="h-[300px] w-full flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={serviceChartData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={(entry) => `${entry.name}: LKR ${entry.value.toLocaleString()}`}>{serviceChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip /></PieChart></ResponsiveContainer></div></div>
              <div><h3 className="text-lg font-semibold text-gray-700 mb-4">Service Breakdown</h3><div className="space-y-3">{serviceAnalysisData.map((item, index) => (<div key={item.service} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: serviceChartData[index]?.color || '#64748B' }} /><span className="font-semibold text-gray-800">{item.service}</span></div></div><div className="grid grid-cols-2 gap-4 mt-2"><div><div className="text-xs text-gray-500">Total Revenue</div><div className="text-lg font-bold text-purple-600">LKR {item.revenue.toLocaleString()}</div></div><div><div className="text-xs text-gray-500">Transactions</div><div className="text-lg font-bold text-gray-700">{item.count}</div></div></div></div>))}</div></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCFE] dark:bg-gray-950 transition-colors">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#1e1534] text-white flex flex-col fixed h-screen overflow-y-auto z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 -translate-x-full">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/40"><img src={logo} alt="Cloud Laundry Logo" className="w-8 h-8 object-contain brightness-0 invert" /></div>
            <div><h1 className="text-lg font-black tracking-tight uppercase leading-none">Cloud Laundry.lk</h1><p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mt-1">Admin Control Center</p></div>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="space-y-1">
                <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${isActive ? 'bg-white/10 text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'}`} /><span className="font-bold text-sm tracking-wide">{item.name}</span>
                  {isActive && <div className="absolute left-0 w-1.5 h-6 bg-purple-500 rounded-r-full" />}
                </button>
                {item.subItems && isActive && (
                  <div className="pl-12 space-y-1 mt-1">
                    {item.subItems.map((sub) => (
                      <button key={sub.id} onClick={() => setActiveTab(sub.id)} className="w-full text-left py-2 text-xs font-bold text-gray-400 hover:text-purple-400 transition-colors uppercase tracking-widest">{sub.name}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg border-2 border-white/10">{user.name.charAt(0)}</div>
            <div className="flex-1 overflow-hidden"><p className="text-sm font-black truncate leading-tight">{user.name}</p><p className="text-[10px] text-purple-400 uppercase font-black tracking-tighter">System Administrator</p></div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all text-xs font-black uppercase tracking-widest border border-red-500/20"><LogOut className="w-4 h-4" /><span>Terminate Session</span></button>
        </div>
      </aside>
      <main className="flex-1 lg:ml-64 min-h-screen bg-[#FDFCFE] dark:bg-gray-950 transition-all duration-300">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BackButton />
            <div className="h-6 w-[1px] bg-gray-100 dark:bg-gray-800" />
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize leading-none">{sidebarItems.find(item => item.id === activeTab)?.name || 'Admin Panel'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" /><input type="text" placeholder="Search resources..." className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20 w-64 dark:text-white transition-all focus:bg-white" /></div>
            <button className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative"><Bell className="w-5 h-5" /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span></button>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm"><ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
          </div>
        </div>
        <div className="p-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'staff-availability' && <StaffAvailabilityManagement />}
            {activeTab === 'task-reassignment' && <TaskReassignmentManagement />}
            {activeTab === 'staff' && <StaffManagement theme={theme} />}
            {activeTab === 'admin-mgmt' && <AdminManagement />}
            {activeTab === 'payments' && renderPaymentRecords()}
            {activeTab === 'inventory' && renderInventoryManagement()}
            {activeTab === 'reviews' && <ReviewsManagement />}
            {activeTab === 'complaints' && <ComplaintsManagement />}
            {activeTab === 'gps' && <GPSTracking />}
            {activeTab === 'reports' && <ReportsManagement />}
            {activeTab === 'settings' && <SystemSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}