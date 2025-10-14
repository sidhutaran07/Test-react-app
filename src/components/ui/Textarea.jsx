export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={
        "w-full min-h-[44px] max-h-[260px] resize-none rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40 " +
        className
      }
      {...props}
    />
  );
}
