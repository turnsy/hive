import { HexagonIcon } from "@/components/icons/icons";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="animate-spin">
        <HexagonIcon />
      </div>
      <div className="text-2xl m-6 font-semibold">Hive</div>
      <div className="text-xl mt-20">Loading project...</div>
    </div>
  );
}
