export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <div className="loading-spinner"></div>
      <p className="mt-4 text-sm font-medium text-gray-400 animate-pulse">Loading NanoLink...</p>
    </div>
  )
}
