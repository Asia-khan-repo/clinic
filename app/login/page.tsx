import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold">ClinicFlow</h1>
      <p className="mb-6 text-sm text-gray-600">Sign in to open patient records.</p>
      <LoginForm
        defaultEmail={process.env.DEMO_EMAIL}
        defaultPassword={process.env.DEMO_PASSWORD}
      />
    </main>
  );
}
