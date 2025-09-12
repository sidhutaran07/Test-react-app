export function Table({ className = "", ...props }) {
  return <table className={`w-full text-sm ${className}`} {...props} />;
}
export const THead = (p) => <thead {...p} />;
export const TBody = (p) => <tbody {...p} />;
export const TR = (p) => <tr className="border-b last:border-none" {...p} />;
export const TH = (p) => <th className="py-2 px-2 text-left font-semibold text-neutral-700" {...p} />;
export const TD = (p) => <td className="py-2 px-2 align-middle" {...p} />;
