import { InfoIcon } from "lucide-react";

export function SelectBanner() {
  return (
    <div className="rounded-md border px-4 py-3">
      <p className="text-sm">
        <InfoIcon className="me-3 -mt-0.5 inline-flex text-[#EF5F00]" size={16} aria-hidden="true" />
        Please select two nodes
      </p>
    </div>
  );
}
