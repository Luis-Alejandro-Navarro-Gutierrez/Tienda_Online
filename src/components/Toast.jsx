import React from "react";
import { Check } from "lucide-react";

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="gs-toast">
      <Check size={15} color="#7C3AED" />
      {message}
    </div>
  );
}