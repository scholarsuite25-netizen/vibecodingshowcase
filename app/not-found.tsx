import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 mb-6">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl text-xs transition-colors"
      >
        Return to Showcase
      </Link>
    </div>
  );
}
