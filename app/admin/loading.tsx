import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center p-24">
      <Loader className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
}
