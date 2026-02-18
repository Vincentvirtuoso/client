import { LuChevronRight, LuUser } from "react-icons/lu";

const UserSection = ({
  loading = false,
  user = null,
  onSignIn = () => {},
  onProfileClick = () => {},
  customAvatar = null,
  customSignInText = "Sign In / Register",
  showProfileLink = true,
  avatarBgFrom = "from-red-600",
  avatarBgTo = "to-pink-500",
  className = "",
  sticky = true,
  showBorder = true,
}) => {
  // Determine the user's initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    const names = user?.fullName?.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div
      className={`
        px-5 py-4
        ${showBorder ? "border-t border-gray-200" : ""}
        bg-white 
        ${sticky ? "sticky bottom-0" : ""}
        ${className}
      `}
    >
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ) : user ? (
        // Authenticated User State
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="View profile"
        >
          {/* Avatar */}
          {customAvatar || (
            <div
              className={`
                w-10 h-10 
                bg-linear-to-br ${avatarBgFrom} ${avatarBgTo}
                rounded-full 
                flex items-center justify-center 
                text-white font-semibold text-md
                shrink-0
                ring-2 ring-white ring-offset-1
                transition-transform group-hover:scale-105
              `}
            >
              {getInitials()}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0 text-left text-xs">
            <p className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
              {user?.fullName}
            </p>
            {showProfileLink && (
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                View Profile
              </p>
            )}
          </div>

          {/* Optional Chevron Indicator */}
          {showProfileLink && <LuChevronRight size={20} />}
        </button>
      ) : (
        // Unauthenticated State - Sign In Button
        <button
          onClick={onSignIn}
          className={`
            w-full 
            flex items-center justify-center gap-3 
            px-4 py-2.5 rounded-lg 
            bg-red-600 text-white
            transition-all duration-200
            font-medium
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            shadow-sm hover:shadow-md
          `}
          aria-label={customSignInText}
        >
          <LuUser className="w-5 h-5 shrink-0" />
          <span>{customSignInText}</span>
        </button>
      )}
    </div>
  );
};

export default UserSection;
