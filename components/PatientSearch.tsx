import Form from "next/form";

export function PatientSearch({ query }: { query: string }) {
  return (
    <Form action="/" className="flex gap-2">
      <input
        name="q"
        defaultValue={query}
        placeholder="Search by name or phone"
        aria-label="Search patients"
        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
      />
      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
      >
        Search
      </button>
    </Form>
  );
}
