import assert from "node:assert/strict";
import test from "node:test";
import { parsePatient, parseVisit, searchTerm } from "../lib/validation.ts";

function fd(entries: Record<string, string | string[]>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    for (const v of Array.isArray(value) ? value : [value]) form.append(key, v);
  }
  return form;
}

test("accepts a valid patient", () => {
  const result = parsePatient(
    fd({
      full_name: "Jane Doe",
      age: "34",
      gender: "Female",
      phone: "5551234",
      address: "1 Main St",
    }),
  );
  assert.deepEqual(result, {
    data: {
      fullName: "Jane Doe",
      age: 34,
      gender: "female",
      phone: "5551234",
      address: "1 Main St",
    },
  });
});

test("rejects missing name and bad age", () => {
  const missingName = parsePatient(fd({ age: "34", gender: "male", phone: "5" }));
  assert.ok("error" in missingName);

  const badAge = parsePatient(
    fd({ full_name: "Jane Doe", age: "141", gender: "female", phone: "555" }),
  );
  assert.ok("error" in badAge);
});

test("visit keeps medicine rows aligned and drops empty ones", () => {
  const result = parseVisit(
    fd({
      visit_date: "2026-09-28",
      complaint: "cough",
      diagnosis: "flu",
      notes: "",
      medicine_name: ["Aspirin", ""],
      dose: ["100mg", ""],
      frequency: ["1x daily", ""],
      duration: ["5 days", ""],
      instructions: ["after food", ""],
    }),
  );
  assert.ok("data" in result);
  assert.equal(result.data.medicines.length, 1);
  assert.equal(result.data.medicines[0].medicineName, "Aspirin");
  assert.equal(result.data.medicines[0].instructions, "after food");
});

test("visit rejects a medicine with a dose but no name", () => {
  const result = parseVisit(
    fd({
      visit_date: "2026-09-28",
      medicine_name: [""],
      dose: ["100mg"],
    }),
  );
  assert.ok("error" in result);
});

test("visit requires a date", () => {
  const result = parseVisit(fd({ visit_date: "" }));
  assert.ok("error" in result);
});

test("searchTerm strips filter metacharacters", () => {
  assert.equal(searchTerm(" 50%,do_e\\ "), "50doe");
  assert.equal(searchTerm(null), "");
});
