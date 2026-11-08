import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
  const { profile } = await requireAdmin();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Painel de Administrador
            </h1>
            <p className="text-sm text-gray-600">Olá, {profile?.full_name}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/cursos"
            className="rounded-2xl bg-white p-6 shadow hover:bg-gray-50"
          >
            <h2 className="font-semibold text-gray-900">Cursos</h2>
            <p className="mt-1 text-sm text-gray-600">
              Criar e gerenciar cursos, módulos e aulas.
            </p>
          </Link>
          <div className="rounded-2xl bg-white p-6 opacity-60 shadow">
            <h2 className="font-semibold text-gray-900">Alunos</h2>
            <p className="mt-1 text-sm text-gray-600">Em breve.</p>
          </div>
        </div>
      </div>
    </main>
  );
}