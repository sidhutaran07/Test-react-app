export function Card({ className = "", ...props }) {
  return <div className={`rounded-xl border border-neutral-200 bg-white ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-5 border-b border-neutral-200 ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-5 ${className}`} {...props} />;
}
