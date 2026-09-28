import { requireUser } from "@/lib/supabase/server";
import { searchTerm } from "@/lib/validation";
import { logout } from "@/app/actions";
import { PatientSearch } from "@/components/PatientSearch";
import { PatientForm } from "@/components/PatientForm";
import {
  PatientDetails,
  type VisitWithMedicines,
} from "@/components/PatientDetails";

type Patient = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  address: string | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; patient?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { q = "", patient: patientId } = await searchParams;
  const query = searchTerm(q);

  let patientsQuery = supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  if (query) {
    patientsQuery = patientsQuery.or(
      `full_name.ilike.%${query}%,phone.eq.${query}`,
    );
  }
  const { data: patients } = await patientsQuery;

  let selected: Patient | null = null;
  let visits: VisitWithMedicines[] = [];
  let missing = false;

  if (patientId) {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();
    selected = data as Patient | null;
    missing = !selected;

    if (selected) {
      const { data: visitRows } = await supabase
        .from("visits")
        .select("*, medications(*)")
        .eq("patient_id", selected.id)
        .order("visit_date", { ascending: false })
        .order("created_at", { ascending: false });
      visits = (visitRows ?? []) as VisitWithMedicines[];
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-semibold">ClinicFlow</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </header>

      <main className="grid flex-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="font-medium">Patients</h2>
            <PatientSearch query={q} />
            <ul className="divide-y divide-gray-100 rounded border border-gray-200">
              {(patients ?? []).length === 0 && (
                <li className="px-3 py-4 text-sm text-gray-600">
                  {query ? "No patients match that search." : "No patients yet."}
                </li>
              )}
              {(patients ?? []).map((p: Patient) => (
                <li key={p.id}>
                  <a
                    href={`/?patient=${p.id}`}
                    className={`block px-3 py-2 text-sm hover:bg-gray-50 ${
                      p.id === patientId ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className="font-medium">{p.full_name}</span>
                    <span className="block text-gray-600">
                      {p.age} · {p.phone}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 rounded border border-gray-200 p-4">
            <h2 className="font-medium">Add patient</h2>
            <PatientForm />
          </section>
        </div>

        <div className="rounded border border-gray-200 p-6">
          {!patientId && (
            <p className="text-sm text-gray-600">
              Select a patient to open their record.
            </p>
          )}
          {missing && (
            <p className="text-sm text-red-600">
              Patient not found. It may belong to another doctor.
            </p>
          )}
          {selected && <PatientDetails patient={selected} visits={visits} />}
        </div>
      </main>
    </div>
  );
}
