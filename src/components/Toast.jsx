import { Check } from "lucide-react";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="nt-toast">
      <Check size={15} color="var(--purple)" />
      {message}
    </div>
  );
}