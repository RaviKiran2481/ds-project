import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center space-y-4 px-4">
      <div>
        <p className="text-7xl font-extrabold bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">404</p>
        <p className="text-xl font-bold mt-2">Page Not Found</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-sm">Return Home</Link>
      </div>
    </div>
  )
}
