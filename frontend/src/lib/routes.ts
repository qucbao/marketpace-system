export interface RouteDirectoryItem {
  href: string;
  label: string;
  description: string;
}

export const routeDirectory: RouteDirectoryItem[] = [
  {
    href: "/login",
    label: "Login",
    description: "Authentication entry point for existing users.",
  },
  {
    href: "/register",
    label: "Register",
    description: "Create a new user account before becoming a shop owner.",
  },
  {
    href: "/products",
    label: "Products",
    description: "Marketplace listing page for available product browsing.",
  },
  {
    href: "/products/1",
    label: "Product Detail",
    description: "Dynamic product detail route scaffold for individual items.",
  },
  {
    href: "/favorites",
    label: "Favorites",
    description: "Saved products view for a specific user.",
  },
  {
    href: "/cart",
    label: "Cart",
    description: "Current cart summary before checkout.",
  },
  {
    href: "/checkout",
    label: "Checkout",
    description: "Checkout handoff for pickup or delivery.",
  },
  {
    href: "/orders",
    label: "Orders",
    description: "Order history list for a user.",
  },
  {
    href: "/shops/register",
    label: "Shop Registration",
    description: "Seller application page for registering a shop.",
  },
  {
    href: "/shops/1",
    label: "Shop Detail",
    description: "Dynamic shop detail route scaffold.",
  },
  {
    href: "/admin/shops",
    label: "Admin Shops",
    description: "Admin review space for approving or rejecting shops.",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Protected owner dashboard foundation.",
  },
];
