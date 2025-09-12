export function Label({ className = "", ...props }) {
  return <label className={`mb-1 block text-sm text-neutral-700 ${className}`} {...props} />;
}
