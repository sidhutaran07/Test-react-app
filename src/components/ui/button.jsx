export function Button({ className = "", variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
  const styles = {
    default: "bg-black text-white hover:bg-neutral-800",
    outline: "border border-neutral-200 hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
