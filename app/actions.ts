"use server";

import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { parsePatient, parseVisit } from "@/lib/validation";

export type FormState = { error?: string } | null;

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };

  redirect("/");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addPatient(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();

  const parsed = parsePatient(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data: patient, error } = await supabase
    .from("patients")
    .insert({
      doctor_id: user.id,
      full_name: parsed.data.fullName,
      age: parsed.data.age,
      gender: parsed.data.gender,
      phone: parsed.data.phone,
      address: parsed.data.address || null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  redirect(`/?patient=${patient.id}`);
}

export async function addVisit(
  patientId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();

  const parsed = parseVisit(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data: visit, error } = await supabase
    .from("visits")
    .insert({
      patient_id: patientId,
      doctor_id: user.id,
      visit_date: parsed.data.visitDate,
      complaint: parsed.data.complaint,
      diagnosis: parsed.data.diagnosis,
      notes: parsed.data.notes,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  if (parsed.data.medicines.length > 0) {
    const { error: medError } = await supabase.from("medications").insert(
      parsed.data.medicines.map((m) => ({
        visit_id: visit.id,
        medicine_name: m.medicineName,
        dose: m.dose,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions || null,
      })),
    );
    if (medError) return { error: medError.message };
  }

  redirect(`/?patient=${patientId}`);
}
