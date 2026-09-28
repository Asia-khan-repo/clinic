"use client";

export type MedicineRow = {
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
};

const input = "rounded border border-gray-300 px-2 py-1.5 text-gray-900";

export function MedicationForm({
  row,
  index,
  onChange,
  onRemove,
}: {
  row: MedicineRow;
  index: number;
  onChange: (row: MedicineRow) => void;
  onRemove: () => void;
}) {
  const set = (key: keyof MedicineRow) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...row, [key]: e.target.value });

  return (
    <div className="flex flex-wrap items-end gap-2 border-b border-gray-100 pb-3">
      <div className="min-w-40 flex-1">
        <label className="block text-xs text-gray-600" htmlFor={`med-${index}`}>
          Medicine
        </label>
        <input
          id={`med-${index}`}
          name="medicine_name"
          value={row.medicineName}
          onChange={set("medicineName")}
          className={`${input} mt-1 w-full`}
        />
      </div>
      <div className="w-24">
        <label className="block text-xs text-gray-600" htmlFor={`dose-${index}`}>
          Dose
        </label>
        <input
          id={`dose-${index}`}
          name="dose"
          value={row.dose}
          onChange={set("dose")}
          className={`${input} mt-1 w-full`}
        />
      </div>
      <div className="w-32">
        <label className="block text-xs text-gray-600" htmlFor={`freq-${index}`}>
          Frequency
        </label>
        <input
          id={`freq-${index}`}
          name="frequency"
          value={row.frequency}
          onChange={set("frequency")}
          className={`${input} mt-1 w-full`}
        />
      </div>
      <div className="w-28">
        <label className="block text-xs text-gray-600" htmlFor={`dur-${index}`}>
          Duration
        </label>
        <input
          id={`dur-${index}`}
          name="duration"
          value={row.duration}
          onChange={set("duration")}
          className={`${input} mt-1 w-full`}
        />
      </div>
      <div className="min-w-40 flex-1">
        <label className="block text-xs text-gray-600" htmlFor={`ins-${index}`}>
          Instructions
        </label>
        <input
          id={`ins-${index}`}
          name="instructions"
          value={row.instructions}
          onChange={set("instructions")}
          className={`${input} mt-1 w-full`}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
      >
        Remove
      </button>
    </div>
  );
}
