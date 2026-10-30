import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../features/auth/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              J
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">JWT Auth</h1>

              <p className="text-xs text-slate-500">User Dashboard</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "User"}!
          </h2>

          <p className="mt-2 text-slate-500">
            You have successfully logged in to your account.
          </p>
        </div>

        {/* Status Card */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-100">
                Authentication status
              </p>

              <h3 className="mt-2 text-2xl font-bold">You are logged in</h3>

              <p className="mt-2 text-sm text-indigo-100">
                Your session has been authenticated by the backend.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              ✓
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">
              Profile Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your registered account details.
            </p>

            <div className="mt-6 flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {user?.name || "User"}
                </h4>

                <p className="text-sm text-slate-500">Registered User</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-2 break-words font-medium text-slate-800">
                  {user?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                <p className="mt-2 break-all font-medium text-slate-800">
                  {user?.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  User ID
                </p>

                <p className="mt-2 font-medium text-slate-800">
                  {user?.id ?? "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account Status
                </p>

                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl text-green-700">
              🔒
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Account Security
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your account uses JWT-based authentication to protect access to
              authorized application features.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Authentication
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                JWT + Express Middleware
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Sign out of account
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          JWT Authentication Demo · React · Redux Toolkit · Node.js · MySQL
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
