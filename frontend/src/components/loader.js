export default function Loader({ message = "Syncing your workspace..." }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-pulse"></div>
        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-pulse delay-150"></div>
        <div className="h-2 w-2 rounded-full bg-neutral-400 animate-pulse delay-300"></div>
      </div>

      <p className="mt-4 text-sm tracking-wide">{message}</p>
    </div>
  );
}
