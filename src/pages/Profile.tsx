import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Store,
  Edit3,
  Lock,
  FileText,
  Clock,
  Camera,
  Bell,
  Eye,
  EyeOff,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Key,
  ChevronRight,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const fields = [
  { key: "full_name", label: "Full name", icon: User },
  { key: "email", label: "Email address", icon: Mail },
  { key: "avatar_url", label: "Profile picture", icon: Camera },
  { key: "phone", label: "Phone number", icon: Phone },
  { key: "location", label: "Location", icon: MapPin },
];

const details = [
  { label: "Full Name", key: "full_name", icon: User },
  { label: "Email", key: "email", icon: Mail },
  { label: "Phone", key: "phone", icon: Phone, fallback: "Not provided" },
  {
    label: "Location",
    key: "location",
    icon: MapPin,
    fallback: "Not provided",
  },
  { label: "Role", key: "role", icon: Shield },
];

const quickActions = [
  {
    label: "Edit Profile",
    icon: Edit3,
    desc: "Update your personal information",
  },
  { label: "Change Password", icon: Lock, desc: "Update your password" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function Toggle({
  label,
  desc,
  enabled: initial,
}: {
  label: string;
  desc: string;
  enabled?: boolean;
}) {
  const [on, setOn] = useState(initial ?? false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {on ? (
        <ToggleRight className="w-6 h-6 text-blue-600 shrink-0" />
      ) : (
        <ToggleLeft className="w-6 h-6 text-gray-300 shrink-0" />
      )}
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", location: "" });
  const [editError, setEditError] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  function openEditor() {
    setForm({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });
    setEditError("");
    setEditing(true);
  }

  function openPasswordEditor() {
    setPwForm({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPwError("");
    setPwSuccess("");
    setChangingPw(true);
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      setPwError("Passwords do not match");
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    setSavingPw(true);
    setPwError("");
    setPwSuccess("");
    try {
      await changePassword(pwForm);
      setPwSuccess("Password updated successfully");
      setPwForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setSavingPw(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await api.upload(file);
      await updateProfile({ avatar_url: url });
      await refreshUser();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setEditError("");
    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone || null,
        location: form.location || null,
      });
      setEditing(false);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function ProfileProgress() {
    const filled = fields.filter((f) => !!user?.[f.key as keyof typeof user]);
    const total = fields.length;
    const pct = Math.round((filled.length / total) * 100);

    return (
      <Card padding="lg" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Profile Completion
              </h2>
              <p className="text-xs text-gray-500">
                {filled.length} of {total} completed
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600">{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fields.map(({ key, label, icon: Icon }) => {
            const done = !!user?.[key as keyof typeof user];
            return (
              <div
                key={key}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${done ? "text-gray-400" : "text-gray-600"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-green-100" : "bg-gray-100"}`}
                >
                  {done ? (
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <Icon className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <span className={done ? "line-through" : ""}>{label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-80">
          <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-14 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <div className="relative mb-16">
            <div className="absolute -bottom-12 left-1/2 sm:left-12 -translate-x-1/2 sm:translate-x-0">
              <div className="relative">
                <Avatar
                  name={user.full_name || "User"}
                  src={user.avatar_url}
                  size="lg"
                  className="w-28 h-28 ring-4 ring-white shadow-2xl"
                />
                {!user.avatar_url && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-white">
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploadingAvatar ? (
                    <svg
                      className="animate-spin w-4 h-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <Camera className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left sm:ml-44 -mt-2 mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.full_name || "User"}
            </h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <Badge variant="info" size="sm">
                {Array.isArray(user.roles)
                  ? user.roles
                      .map((r: any) => (typeof r === "string" ? r : r.name))
                      .join(", ")
                  : user.role}
              </Badge>
              {user.is_dealer && (
                <Badge variant="success" size="sm">
                  Dealer
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
          <ProfileProgress />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.map(({ label, key, icon: Icon, fallback }) => {
                  const value = user[key as keyof typeof user];
                  return (
                    <div
                      key={key}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                          {typeof value === "string" && value
                            ? value
                            : Array.isArray(value)
                              ? value
                                  .map((item: any) =>
                                    typeof item === "string" ? item : item.name,
                                  )
                                  .join(", ")
                              : typeof value === "object" &&
                                  value !== null &&
                                  "name" in value
                                ? (value as any).name
                                : key === "role" &&
                                    Array.isArray(user.roles) &&
                                    user.roles.length
                                  ? user.roles
                                      .map((r: any) =>
                                        typeof r === "string" ? r : r.name,
                                      )
                                      .join(", ")
                                  : (fallback ?? "—")}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {user.dealer_name && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dealer Name
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                        {user.dealer_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.13 }}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Security
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Email
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Password
                      </p>
                      <p className="text-xs text-gray-500">Set and secure</p>
                    </div>
                  </div>
                  <button onClick={() => {}}>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.16 }}>
          <Card padding="lg" className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Toggle
                label="Notifications"
                desc="Receive updates via email"
                enabled
              />
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <Edit3 className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {quickActions.map(({ label, icon: Icon, desc }) => (
                <button
                  key={label}
                  onClick={() =>
                    label === "Edit Profile"
                      ? openEditor()
                      : label === "Change Password"
                        ? openPasswordEditor()
                        : null
                  }
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setEditing(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {editError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm">
                    {editError}
                  </div>
                )}
                <Input
                  label="Full Name"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="City, State"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving}>
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {changingPw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setChangingPw(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
                {pwError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm">
                    {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-sm">
                    {pwSuccess}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-800">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={pwForm.current_password}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          current_password: e.target.value,
                        })
                      }
                      className="block w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-800">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={pwForm.new_password}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, new_password: e.target.value })
                      }
                      className="block w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-400"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-800">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={pwForm.new_password_confirmation}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          new_password_confirmation: e.target.value,
                        })
                      }
                      className="block w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setChangingPw(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={savingPw}>
                    <Lock className="w-4 h-4" /> Update Password
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
