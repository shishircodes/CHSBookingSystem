import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-slate-300">404</h1>
      <p className="mt-2 text-slate-600">That page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Go home</Link>
    </div>
  );
}
