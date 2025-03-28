export const navBarItems: {
  name: string;
  href: string;
  public?: boolean;
}[] = [
  {
    name: "Home",
    href: "/",
    public: true,
  },
  {
    name: "Map",
    href: "/map",
    public: true,
  },
  {
    name: "Admin",
    href: "/admin",
  },
  {
    name: "Feedback",
    href: "/feedback",
    public: true,
  },
  {
    name: "Contact",
    href: "/contact",
    public: true,
  },
];

export const adminRoutes = [
  { key: "dashboard", label: "Dashboard", href: "/admin" },
  { key: "log", label: "API Log", href: "/admin/log" },
  { key: "analytics", label: "Analytics", href: "/admin/analytics" },
  { key: "add-toilet", label: "Add Toilet", href: "/admin/add-toilet" },
];
