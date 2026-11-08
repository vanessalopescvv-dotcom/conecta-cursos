import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

async function StudentContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus cursos</h1>
            <p className="text-sm text-gray-600">Olá, {profile?.full_name}</p>
          </div>
          <LogoutButton />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-700">
            Em breve: seus cursos e aulas aparecem aqui.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<p className="p-8 text-gray-600">Carregando...</p>}>
      <StudentContent />
    </Suspense>
  );
}