"use client";

import { useState, useActionState } from "react";
import { addVisit, type FormState } from "@/app/actions";
import { MedicationForm, type MedicineRow } from "@/components/MedicationForm";

const emptyRow = (): MedicineRow => ({
  medicineName: "",
  dose: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const input =
  "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900";

export function VisitForm({ patientId }: { patientId: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addVisit.bind(null, patientId),
    null,
  );
  const [rows, setRows] = useState<MedicineRow[]>([emptyRow()]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="visit_date" className="block text-sm font-medium">
            Visit date
          </label>
          <input
            id="visit_date"
            name="visit_date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="complaint" className="block text-sm font-medium">
            Symptoms / complaint
          </label>
          <input id="complaint" name="complaint" className={input} />
        </div>
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium">
            Diagnosis / assessment
          </label>
          <input id="diagnosis" name="diagnosis" className={input} />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Clinical notes
          </label>
          <input id="notes" name="notes" className={input} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Medicines</span>
          <button
            type="button"
            onClick={() => setRows((r) => [...r, emptyRow()])}
            className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
          >
            Add medicine
          </button>
        </div>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <MedicationForm
              key={i}
              row={row}
              index={i}
              onChange={(next) =>
                setRows((r) => r.map((x, j) => (j === i ? next : x)))
              }
              onRemove={() =>
                setRows((r) =>
                  r.length === 1 ? [emptyRow()] : r.filter((_, j) => j !== i),
                )
              }
            />
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save visit"}
      </button>
    </form>
  );
}
