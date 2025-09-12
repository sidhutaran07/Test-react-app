export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${props.className || ""}`}
    />
  );
}
