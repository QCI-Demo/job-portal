import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div className="px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">403 — Access Denied</h1>
      <p className="mt-2 text-slate-600">You do not have permission to view this page.</p>
      <Link to="/" className="mt-6 inline-block text-blue-700 underline">
        Return to home
      </Link>
    </div>
  );
}
