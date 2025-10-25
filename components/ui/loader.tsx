import { Loader as LucideLoader } from "lucide-react";

export function Loader() {
  return (
    <div className="flex h-full items-center justify-center p-24">
      <LucideLoader className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
}
