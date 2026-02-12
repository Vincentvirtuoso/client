import { LuTruck, LuSettings } from "react-icons/lu";

import { FiInfo } from "react-icons/fi";
const ShippingForm = ({
  form,
  handleChange,
  saveShippingInfo,
  savedShippingInfo,
  setSaveShippingInfo,
  loadSavedShippingInfo,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <LuTruck className="w-5 h-5" />
        Shipping Information
      </h2>

      {savedShippingInfo && (
        <div className="space-y-3">
          {/* Saved Info Card */}
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-green-800">
                      Saved shipping information available
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {savedShippingInfo.firstName} {savedShippingInfo.lastName}{" "}
                      • {`${savedShippingInfo.addressLine1} ,`}{" "}
                      {savedShippingInfo.city} • Saved{" "}
                      {new Date(savedShippingInfo.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadSavedShippingInfo}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 
                       transition-colors text-sm font-medium shadow-sm hover:shadow 
                       flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Load This Address
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Prompt */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3">
              {/* Info Icon */}
              <div className="shrink-0">
                <FiInfo className="inline-flex text-xl text-blue-800" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-blue-800">
                    Manage your shipping addresses
                  </p>
                  <p className="text-sm text-blue-700 mt-0.5">
                    Update or add new addresses in your account settings for
                    faster checkout
                  </p>
                </div>
                <a
                  href="/account/settings" // Update this path as needed
                  className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 
                     bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors 
                     text-sm font-medium shadow-sm whitespace-nowrap gap-2"
                >
                  <LuSettings className="w-4 h-4" />
                  Account Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              First Name *
            </span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="John"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Last Name *
            </span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email *</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Phone *</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Address Line 1 *
          </span>
          <input
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Address Line 2 (Optional)
          </span>
          <input
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Apartment 4B, Suite 2"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">City *</span>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Lagos"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">State *</span>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Lagos State"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Postal Code *
            </span>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="100001"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Country</span>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Delivery Instructions (Optional)
          </span>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Leave at the gate, call before delivery, etc."
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </label>

        {!savedShippingInfo && (
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="saveShippingInfo"
                checked={saveShippingInfo}
                onChange={(e) => setSaveShippingInfo(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="font-medium text-gray-900">
                  Save shipping information for future orders
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Your shipping details will be saved securely in your browser
                  for faster checkout next time.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShippingForm;
