import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Award, 
  Bell, 
  FileText, 
  Settings, 
  LogOut, 
  Package, 
  Edit, 
  X, 
  Trash2, 
  User as UserProfileIcon, 
  Camera, 
  Save,
  LayoutDashboard,
  ChevronRight,
  Search,
  ClipboardList,
  Sparkles,
  ChevronDown,
  Menu
} from 'lucide-react';
import LoyaltyManagement from './LoyaltyManagement';
import BackButton from './BackButton';
import type { User } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from 'figma:asset/d0e24839a24076173960597a25c12b48f3330fdf.png';

// Dashboard Components
import { 
  DashboardHeader, 
  UpcomingBookingCard, 
  QuickActions, 
  ActivityFeed, 
  LoyaltyPointsCard, 
  EmptyBookingState,
  EmptyState
} from './dashboard/OverviewCards';
import LoadingSkeletons from './dashboard/LoadingSkeletons';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function CustomerDashboard({ user, onLogout, theme, onToggleTheme }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
  const [language, setLanguage] = useState('English');
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    address: '',
    profilePicture: localStorage.getItem('userProfilePicture') || '',
  });

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', name: 'My Bookings', icon: ClipboardList },
    { id: 'loyalty', name: 'Loyalty Points', icon: Award },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'profile', name: 'My Profile', icon: UserProfileIcon },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM',
  ];

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    setBookings(storedBookings);
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const upcomingBookings = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'completed') return false;
    return new Date(b.date) >= new Date(new Date().setHours(0,0,0,0));
  });

  const handleReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setRescheduleData({ date: booking.date, time: booking.time });
    setShowRescheduleModal(true);
  };

  const handleCancel = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmReschedule = () => {
    if (selectedBooking && rescheduleData.date && rescheduleData.time) {
      const updatedBookings = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, date: rescheduleData.date, time: rescheduleData.time }
          : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      setShowRescheduleModal(false);
      setSelectedBooking(null);
    }
  };

  const confirmCancel = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, status: 'cancelled' }
          : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileData({ ...profileData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfilePicture', profileData.profilePicture);
    localStorage.setItem('userProfileData', JSON.stringify(profileData));
    alert('Profile updated successfully!');
  };

  const notifications = [
    { id: 1, type: 'reminder', message: 'Your cleaning service is scheduled for tomorrow at 10:00 AM', time: '2 hours ago' },
    { id: 2, type: 'offer', message: '20% off on your next laundry service!', time: '1 day ago' },
    { id: 3, type: 'points', message: 'You earned 50 loyalty points from your recent booking', time: '3 days ago' },
  ];

  const renderOverview = () => {
    if (loading) return <LoadingSkeletons />;

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <DashboardHeader name={user.name} />
        
        <div className="flex flex-col gap-6">
          {/* Row 1: Upcoming Booking or Empty State */}
          <div className="w-full">
            {upcomingBookings.length > 0 ? (
              <UpcomingBookingCard 
                booking={upcomingBookings[0]} 
                onReschedule={handleReschedule} 
                onCancel={handleCancel} 
              />
            ) : (
              <EmptyBookingState />
            )}
          </div>

          {/* Row 2: Loyalty Points */}
          <div className="w-full">
            <LoyaltyPointsCard />
          </div>
        </div>
      </div>
    );
  };

  const renderBookings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 dark:text-white">My Bookings History</h2>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <div key={idx} className="border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">
                      {booking.serviceType || booking.serviceName || 'Cleaning Service'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">ID: {booking.bookingId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">LKR {booking.price?.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => handleReschedule(booking)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-sm transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(booking)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                <Link
                  to={`/invoice/${booking.bookingId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black font-bold text-sm transition-all ml-auto"
                >
                  <FileText className="w-4 h-4" />
                  View Invoice
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No Bookings Yet"
          message="You haven't made any bookings yet."
          actionLabel="Explore Services"
          actionLink="/services"
        />
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Recent Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="group border-l-4 border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-r-2xl transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-900 dark:text-white">{notification.message}</p>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{notification.type}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold dark:text-white">Account Profile</h2>
        <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40 rounded-full bg-purple-50 dark:bg-purple-900/20 overflow-hidden border-4 border-purple-100 dark:border-purple-800">
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserProfileIcon className="w-24 h-24 text-purple-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all">
            <Camera className="w-4 h-4" />
            <span>Update Photo</span>
            <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+94 XX XXX XXXX"
                className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-800 flex items-center gap-3">
                <Award className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-[10px] font-black uppercase text-purple-400">Membership</p>
                  <p className="text-sm font-bold text-purple-900 dark:text-purple-100">{user.badge} Level</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Billing Address</label>
            <textarea
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFE] dark:bg-gray-900 transition-colors">
      {/* Sidebar - Desktop */}
      <aside className={`w-64 bg-[#1e1534] text-white flex flex-col fixed h-screen overflow-y-auto z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Branding */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-xl">
              <img src={logo} alt="Cloud Laundry Logo" className="w-8 h-8 object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">CLOUD LAUNDRY.LK</h1>
              <p className="text-[10px] text-purple-300 font-medium uppercase tracking-widest">Customer Panel</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'}`} />
                <span className="font-medium truncate">{item.name}</span>
                {isActive && <div className="w-1 h-1 bg-purple-400 rounded-full ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Bottom */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/10">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-purple-400 uppercase font-medium">{user.badge} Member</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <BackButton />
            <div className="hidden sm:block pl-4 border-l border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {sidebarItems.find(item => item.id === activeTab)?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 w-64 dark:text-white"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto transition-all duration-300">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'loyalty' && <LoyaltyManagement user={user} />}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold dark:text-white mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h3 className="font-bold dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500">Toggle system theme preference</p>
                    </div>
                    <button 
                      onClick={onToggleTheme}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm"
                    >
                      Toggle Theme
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="font-bold dark:text-white">Language</h3>
                        <p className="text-sm text-gray-500">Select your preferred display language</p>
                      </div>
                      <div className="flex gap-2">
                        {['English', 'Sinhala', 'Tamil'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                              language === lang
                                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reschedule</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">New Date</label>
                <DatePicker
                  selected={rescheduleData.date ? new Date(rescheduleData.date) : null}
                  onChange={(date: Date | null) => setRescheduleData({ ...rescheduleData, date: date ? date.toISOString().split('T')[0] : '' })}
                  minDate={new Date()}
                  className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">New Time</label>
                <select
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-xl outline-none"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={confirmReschedule} className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all">Update Schedule</button>
              <button onClick={() => setShowRescheduleModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-4 rounded-2xl font-bold">Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 text-red-600">
              <h2 className="text-2xl font-bold">Cancel Booking</h2>
              <X onClick={() => setShowCancelModal(false)} className="w-6 h-6 cursor-pointer" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to cancel booking <span className="font-bold text-gray-900 dark:text-white">#{selectedBooking?.bookingId}</span>? This action will notify the team and might incur a fee if within 24 hours.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmCancel} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all">Cancel Booking</button>
              <button onClick={() => setShowCancelModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-4 rounded-2xl font-bold">Keep it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}