"use client";

import { useState, useActionState } from "react";
import { addPatient, type FormState } from "@/app/actions";

const empty = { full_name: "", age: "", gender: "", phone: "", address: "" };

export function PatientForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addPatient,
    null,
  );
  const [values, setValues] = useState(empty);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const input =
    "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900";

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            value={values.full_name}
            onChange={set("full_name")}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            max={130}
            required
            value={values.age}
            onChange={set("age")}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={values.gender}
            onChange={set("gender")}
            className={input}
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            required
            value={values.phone}
            onChange={set("phone")}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Address <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="address"
            name="address"
            value={values.address}
            onChange={set("address")}
            className={input}
          />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Add patient"}
      </button>
    </form>
  );
}
