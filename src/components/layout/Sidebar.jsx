import { Link, useLocation } from "react-router-dom";
import {
  Home, Users, Calendar, FileText, Megaphone, ClipboardList,
  BarChart3, Settings, ChevronLeft, ChevronRight, Shield, X, Layout, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const memberLinks = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/requests", icon: ClipboardList, label: "Requests" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/profile", icon: Users, label: "My Profile" },
];

const adminLinks = [
  { to: "/admin", icon: Shield, label: "Admin Panel" },
  { to: "/admin/members", icon: Users, label: "Members" },
  { to: "/admin/events", icon: Calendar, label: "Events" },
  { to: "/admin/documents", icon: FileText, label: "Documents" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/admin/requests", icon: ClipboardList, label: "Requests" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/cms", icon: Layout, label: "CMS" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ collapsed, setCollapsed, userRole, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  const links = [
    ...memberLinks,
    ...(isAdmin ? [{ divider: true, label: "Administration" }] : []),
    ...(isAdmin ? adminLinks : []),
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69ca1dd832db930f6890ae13/4faf2f698_image.png" alt="KNPI" className="w-8 h-8 object-contain" />
            <span className="font-heading font-bold text-sm text-sidebar-foreground">KNPI Connect</span>
          </div>
        )}
        <button
          onClick={() => {
            if (mobileOpen) setMobileOpen(false);
            else setCollapsed(!collapsed);
          }}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors lg:block"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((item, i) => {
          if (item.divider) {
            return (
              <div key={i} className="pt-4 pb-2">
                {!collapsed && (
                  <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                )}
                {collapsed && <div className="border-t border-sidebar-border" />}
              </div>
            );
          }

          const isActive = location.pathname === item.to || 
            (item.to !== "/dashboard" && item.to !== "/admin" && location.pathname.startsWith(item.to));
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => mobileOpen && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-sidebar h-full shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}