import { motion } from "framer-motion";
import { useState } from "react";

interface Delegate {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "active" | "inactive";
  lastActivity: string;
  createdAt: string;
}

const SettingsTab = () => {
  const [showNewDelegateForm, setShowNewDelegateForm] = useState(false);
  const [newDelegate, setNewDelegate] = useState({
    name: "",
    email: "",
    role: "moderator",
    permissions: [] as string[],
  });

  const dummyDelegates: Delegate[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@uplist.com",
      role: "Senior Moderator",
      permissions: ["artist_verification", "content_moderation", "user_management"],
      status: "active",
      lastActivity: "2 hours ago",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@uplist.com",
      role: "Content Moderator",
      permissions: ["content_moderation", "report_review"],
      status: "active",
      lastActivity: "1 day ago",
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@uplist.com",
      role: "Artist Verifier",
      permissions: ["artist_verification"],
      status: "inactive",
      lastActivity: "1 week ago",
      createdAt: "2024-03-10",
    },
  ];

  const availablePermissions = [
    { id: "artist_verification", label: "Artist Verification" },
    { id: "content_moderation", label: "Content Moderation" },
    { id: "user_management", label: "User Management" },
    { id: "report_review", label: "Report Review" },
    { id: "payment_management", label: "Payment Management" },
    { id: "system_settings", label: "System Settings" },
  ];

  const handlePermissionToggle = (permissionId: string) => {
    setNewDelegate(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleCreateDelegate = () => {
    // Handle delegate creation logic here
    console.log("Creating new delegate:", newDelegate);
    setShowNewDelegateForm(false);
    setNewDelegate({ name: "", email: "", role: "moderator", permissions: [] });
  };

  const handleRemoveDelegate = (delegateId: string) => {
    // Handle delegate removal logic here
    console.log("Removing delegate:", delegateId);
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "text-green-400" : "text-red-400";
  };

  const getStatusBg = (status: string) => {
    return status === "active" ? "bg-green-500/20" : "bg-red-500/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
        <p className="text-white/70">Manage platform configuration and account delegation</p>
      </div>

      {/* Account Delegation Section */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Account Delegation</h3>
          <button
            onClick={() => setShowNewDelegateForm(true)}
            className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors"
          >
            Add New Delegate
          </button>
        </div>

        {/* New Delegate Form */}
        {showNewDelegateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/20 p-4 mb-6 rounded-lg"
          >
            <h4 className="text-white font-semibold mb-4">New Delegate Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={newDelegate.name}
                  onChange={(e) => setNewDelegate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
                  placeholder="Enter delegate name"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={newDelegate.email}
                  onChange={(e) => setNewDelegate(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
                  placeholder="Enter delegate email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white/70 text-sm mb-2">Role</label>
              <select
                value={newDelegate.role}
                onChange={(e) => setNewDelegate(prev => ({ ...prev, role: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
              >
                <option value="moderator">Moderator</option>
                <option value="verifier">Artist Verifier</option>
                <option value="admin">Administrator</option>
                <option value="support">Support Agent</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white/70 text-sm mb-2">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      checked={newDelegate.permissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                    />
                    {permission.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateDelegate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Create Delegate
              </button>
              <button
                onClick={() => setShowNewDelegateForm(false)}
                className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Delegates List */}
        <div className="space-y-4">
          {dummyDelegates.map((delegate) => (
            <motion.div
              key={delegate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{delegate.name}</h4>
                  <p className="text-white/60 text-sm">{delegate.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(delegate.status)} ${getStatusColor(delegate.status)}`}>
                    {delegate.status}
                  </span>
                  <button
                    onClick={() => handleRemoveDelegate(delegate.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-white/70">Role: </span>
                  <span className="text-white">{delegate.role}</span>
                </div>
                <div>
                  <span className="text-white/70">Last Activity: </span>
                  <span className="text-white">{delegate.lastActivity}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-white/70 text-sm">Permissions: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {delegate.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded"
                    >
                      {permission.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Platform Settings Section */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Platform Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/70 text-sm mb-2">Commission Rate (%)</label>
            <input
              type="number"
              defaultValue="10"
              className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Auto-verification Threshold</label>
            <input
              type="number"
              defaultValue="4.5"
              className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Payment Gateway</label>
            <select className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none">
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Razorpay</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Default Currency</label>
            <select className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none">
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-orange-500 text-black px-6 py-2 font-semibold hover:bg-orange-600 transition-colors rounded">
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
