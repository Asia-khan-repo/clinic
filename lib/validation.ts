export type PatientInput = {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
};

export type MedicineInput = {
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
};

export type VisitInput = {
  visitDate: string;
  complaint: string;
  diagnosis: string;
  notes: string;
  medicines: MedicineInput[];
};

export type Result<T> = { data: T } | { error: string };

const GENDERS = ["female", "male", "other"];

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parsePatient(fd: FormData): Result<PatientInput> {
  const fullName = text(fd.get("full_name"));
  const phone = text(fd.get("phone"));
  const ageRaw = text(fd.get("age"));
  const gender = text(fd.get("gender")).toLowerCase();

  if (fullName.length < 2) return { error: "Full name is required." };

  const age = Number(ageRaw);
  if (!Number.isInteger(age) || age < 0 || age > 130) {
    return { error: "Age must be a whole number between 0 and 130." };
  }

  if (!GENDERS.includes(gender)) return { error: "Gender is required." };
  if (phone.length < 5) return { error: "Phone number is required." };

  return {
    data: {
      fullName,
      age,
      gender,
      phone,
      address: text(fd.get("address")),
    },
  };
}

export function parseVisit(fd: FormData): Result<VisitInput> {
  const visitDate = text(fd.get("visit_date"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
    return { error: "Visit date is required." };
  }

  const names = fd.getAll("medicine_name").map(text);
  const doses = fd.getAll("dose").map(text);
  const frequencies = fd.getAll("frequency").map(text);
  const durations = fd.getAll("duration").map(text);
  const instructions = fd.getAll("instructions").map(text);

  const medicines: MedicineInput[] = [];
  for (let i = 0; i < names.length; i++) {
    const row: MedicineInput = {
      medicineName: names[i] ?? "",
      dose: doses[i] ?? "",
      frequency: frequencies[i] ?? "",
      duration: durations[i] ?? "",
      instructions: instructions[i] ?? "",
    };
    if (!row.medicineName && !row.dose) continue;
    if (!row.medicineName) return { error: "Every medicine needs a name." };
    medicines.push(row);
  }

  return {
    data: {
      visitDate,
      complaint: text(fd.get("complaint")),
      diagnosis: text(fd.get("diagnosis")),
      notes: text(fd.get("notes")),
      medicines,
    },
  };
}

export function searchTerm(raw: FormDataEntryValue | null): string {
  // Supabase `or()` filters are comma-separated: strip characters that would
  // break out of the pattern.
  return text(raw).replace(/[,%_\\]/g, "").slice(0, 60);
}
