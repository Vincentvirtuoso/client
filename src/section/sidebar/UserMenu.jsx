import { LuLogOut, LuPackage, LuSettings } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const UserMenu = ({
  user = null,
  ordersCount = 0,
  onSignOut = () => {},
  menuItems = [],
  customItems = [],
  className = "",
  containerClassName = "",
  showDivider = true,
  variant = "default",
  onItemClick = () => {},
  loading = false,
  menuLoaders = {},
}) => {
  const variants = {
    default: {
      link: "text-gray-700 hover:bg-red-50 hover:text-red-600",
      button: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
      active: "bg-red-50 text-red-600",
      skeleton: "bg-gray-200",
    },
    minimal: {
      link: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      button: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      active: "bg-gray-100 text-gray-900",
      skeleton: "bg-gray-200",
    },
    dark: {
      link: "text-gray-300 hover:bg-gray-700 hover:text-white",
      button: "text-gray-300 hover:bg-gray-700 hover:text-white",
      active: "bg-gray-700 text-white",
      skeleton: "bg-gray-600",
    },
  };

  const currentVariant = variants[variant] || variants.default;
  const {
    orders: ordersLoading,
    // wishlist: wishlistLoading = false,
    // notifications: notificationsLoading = false,
  } = menuLoaders;

  if (!user && !loading) return null;

  if (loading) {
    return (
      <div
        className={`
          ${showDivider ? "border-t border-gray-200" : ""}
          ${containerClassName}
        `}
      >
        <div className={`px-4 py-3 space-y-2 ${className}`}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="
                flex items-center gap-3
                px-4 py-2.5
                rounded-lg
                animate-pulse
              "
            >
              {/* Icon */}
              <div className={`w-5 h-5 rounded ${currentVariant.skeleton}`} />

              {/* Label */}
              <div className={`h-4 w-32 rounded ${currentVariant.skeleton}`} />

              {/* Badge */}
              <div
                className={`ml-auto h-5 w-8 rounded-full ${currentVariant.skeleton}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const defaultMenuItems = [
    {
      id: "orders",
      label: "My Orders",
      to: "/orders",
      icon: <LuPackage className="w-5 h-5" />,
      type: "link",
      count: ordersCount,
      countsLoading: ordersLoading,
    },
    {
      id: "settings",
      label: "Settings",
      to: "/settings",
      icon: <LuSettings className="w-5 h-5" />,
      type: "link",
    },
  ];

  const allMenuItems = [
    ...(menuItems.length ? menuItems : defaultMenuItems),
    ...customItems,
    {
      id: "signout",
      label: "Sign Out",
      icon: <LuLogOut className="w-5 h-5" />,
      type: "button",
      onClick: onSignOut,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  const renderCountBadge = (count, isLoading = false) => {
    if (count === undefined || count === null) return null;

    return (
      <span
        className={`
      flex items-center justify-center
      min-w-6 h-6
      px-1.5
      text-xs font-medium
      rounded-full
      transition-colors duration-200
      ${
        isLoading
          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 animate-pulse"
          : "bg-red-500 text-white"
      }
    `}
      >
        {isLoading ? (
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : count > 99 ? (
          "99+"
        ) : (
          count
        )}
      </span>
    );
  };

  return (
    <div
      className={`
        ${showDivider ? "border-t border-gray-200" : ""}
        ${containerClassName}
      `}
    >
      <div className={`px-4 py-2 space-y-1 ${className}`}>
        {allMenuItems.map((item) => {
          const baseClasses = `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 w-full text-left ${item.className || ""}`;

          if (item.type === "button") {
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  onItemClick(item.id);
                }}
                className={`${baseClasses} ${currentVariant.button}`}
                disabled={item?.countsLoading}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {renderCountBadge(item.count, item?.countsLoading)}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? currentVariant.active : currentVariant.link
                } ${item?.countsLoading ? "opacity-70 cursor-wait" : ""}`
              }
              onClick={(e) => {
                if (item?.countsLoading) {
                  e.preventDefault();
                  return;
                }
                onItemClick(item.id);
              }}
              aria-disabled={item?.countsLoading}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {renderCountBadge(item.count, item?.countsLoading)}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default UserMenu;
