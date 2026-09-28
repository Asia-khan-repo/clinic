"use client";

import { useActionState, useEffect, useRef } from "react";
import { login, type FormState } from "@/app/actions";

export function LoginForm({
  defaultEmail = "",
  defaultPassword = "",
}: {
  defaultEmail?: string;
  defaultPassword?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    login,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (defaultEmail && defaultPassword) formRef.current?.requestSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaultEmail}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue={defaultPassword}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
