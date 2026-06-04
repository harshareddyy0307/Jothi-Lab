import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, ReceiptText, FlaskConical, 
  FileSpreadsheet, Stethoscope, UserCheck, Download, 
  Settings, ChevronLeft, ChevronRight, Activity, CreditCard, ShieldCheck, PenTool, MessageCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['Admin', 'Receptionist', 'Pathologist', 'Lab Technician', 'Staff', 'Doctor']
    },
    {
      name: 'Patients',
      path: '/patients',
      icon: Users,
      roles: ['Admin', 'Receptionist', 'Pathologist', 'Lab Technician', 'Staff', 'Doctor']
    },
    {
      name: 'Billing Desk',
      path: '/billing',
      icon: ReceiptText,
      roles: ['Admin', 'Receptionist']
    },
    {
      name: 'Payment History',
      path: '/payments',
      icon: CreditCard,
      roles: ['Admin', 'Receptionist']
    },
    {
      name: 'Claim Tracking',
      path: '/claims',
      icon: ShieldCheck,
      roles: ['Admin', 'Receptionist']
    },
    {
      name: 'Tests Catalog',
      path: '/tests',
      icon: FlaskConical,
      roles: ['Admin', 'Pathologist', 'Lab Technician']
    },
    {
      name: 'Reports Queue',
      path: '/reports',
      icon: FileSpreadsheet,
      roles: ['Admin', 'Pathologist', 'Lab Technician', 'Doctor']
    },
    {
      name: 'Referral Doctors',
      path: '/doctors',
      icon: Stethoscope,
      roles: ['Admin', 'Receptionist']
    },
    {
      name: 'Staff Management',
      path: '/employees',
      icon: UserCheck,
      roles: ['Admin']
    },
    {
      name: 'Data Exports',
      path: '/exports',
      icon: Download,
      roles: ['Admin', 'Pathologist']
    },
    {
      name: 'Signatures',
      path: '/signatures',
      icon: PenTool,
      roles: ['Admin', 'Pathologist', 'Doctor']
    },
    {
      name: 'WhatsApp Delivery',
      path: '/whatsapp',
      icon: MessageCircle,
      roles: ['Admin', 'Receptionist', 'Pathologist']
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['Admin']
    }
  ];

  // Filter routes based on user roles
  const filteredMenu = menuItems.filter(item => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return item.roles.includes(user.role);
  });

  return (
    <aside 
      className={`relative z-20 flex flex-col border-r border-slate-200 bg-navy-900 text-white transition-all duration-300 dark:border-navy-800 ${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral-500 text-white shadow-lg shadow-coral-500/30">
            <Activity size={20} />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-wider text-white whitespace-nowrap">
              Jyothi <span className="text-coral-500">Lab</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 py-4 px-3 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20' 
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle Trigger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 -right-3.5 hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-800 shadow-md hover:bg-slate-50 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-300 dark:hover:bg-navy-800"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
