import { LuTruck } from "react-icons/lu";

const ShippingForm = ({
  form,
  handleChange,
  saveShippingInfo,
  savedShippingInfo,
  setSaveShippingInfo,
  loadSavedShippingInfo,
  clearSavedShippingInfo,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <LuTruck className="w-5 h-5" />
        Shipping Information
      </h2>

      {savedShippingInfo && (
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={clearSavedShippingInfo}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Clear saved shipping information
          </button>
          <span className="text-xs text-gray-500">
            Last saved:{" "}
            {new Date(savedShippingInfo.savedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      <div className="space-y-4">
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

        {/* Save for next order option */}
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
                Your shipping details will be saved securely in your browser for
                faster checkout next time.
              </p>
            </div>
          </label>

          {/* Load saved info button - Only show if there's saved data */}
          {savedShippingInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    Saved shipping information available
                  </p>
                  <p className="text-sm text-blue-700">
                    {savedShippingInfo.firstName} {savedShippingInfo.lastName} •{" "}
                    {savedShippingInfo.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadSavedShippingInfo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Load Saved Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShippingForm;
