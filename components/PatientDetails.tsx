import { VisitForm } from "@/components/VisitForm";

export type Medicine = {
  id: string;
  medicine_name: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
};

export type VisitWithMedicines = {
  id: string;
  visit_date: string;
  complaint: string | null;
  diagnosis: string | null;
  notes: string | null;
  medications: Medicine[] | null;
};

type Patient = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  address: string | null;
};

function Line({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <p className="text-sm text-gray-700">
      <span className="font-medium text-gray-900">{label}:</span> {value}
    </p>
  );
}

export function PatientDetails({
  patient,
  visits,
}: {
  patient: Patient;
  visits: VisitWithMedicines[];
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{patient.full_name}</h2>
        <p className="text-sm text-gray-600">
          {patient.age} years · {patient.gender} · {patient.phone}
        </p>
        <Line label="Address" value={patient.address} />
      </div>

      <details className="rounded border border-gray-200 p-4">
        <summary className="cursor-pointer font-medium">New visit</summary>
        <div className="mt-4">
          <VisitForm patientId={patient.id} />
        </div>
      </details>

      <div>
        <h3 className="mb-3 font-medium">Visit history</h3>
        {visits.length === 0 ? (
          <p className="text-sm text-gray-600">No visits recorded yet.</p>
        ) : (
          <ol className="space-y-4">
            {visits.map((visit) => (
              <li
                key={visit.id}
                className="rounded border border-gray-200 p-4"
              >
                <p className="font-medium">{visit.visit_date}</p>
                <Line label="Complaint" value={visit.complaint} />
                <Line label="Diagnosis" value={visit.diagnosis} />
                <Line label="Notes" value={visit.notes} />
                {visit.medications && visit.medications.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                    {visit.medications.map((m) => (
                      <li key={m.id}>
                        {m.medicine_name}
                        {m.dose ? ` — ${m.dose}` : ""}
                        {m.frequency ? `, ${m.frequency}` : ""}
                        {m.duration ? `, ${m.duration}` : ""}
                        {m.instructions ? ` (${m.instructions})` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
