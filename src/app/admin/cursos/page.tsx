import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { createCourse, deleteCourse } from "./actions";

const erros: Record<string, string> = {
  titulo: "Digite o título do curso.",
  criar: "Não foi possível criar o curso.",
  excluir: "Não foi possível excluir o curso.",
};

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { erro } = await searchParams;

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            ← Voltar ao painel
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Cursos</h1>
        </div>

        {erro && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erros[erro] ?? "Algo deu errado."}
          </p>
        )}

        <form
          action={createCourse}
          className="space-y-3 rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="font-semibold text-gray-900">Novo curso</h2>
          <input
            name="title"
            required
            placeholder="Título do curso"
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900"
          />
          <textarea
            name="description"
            rows={3}
            placeholder="Descrição (opcional)"
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            Criar curso
          </button>
        </form>

        <div className="space-y-3">
          {courses?.length === 0 && (
            <p className="text-sm text-gray-600">Nenhum curso criado ainda.</p>
          )}

          {courses?.map((course) => (
            <div
              key={course.id}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                {course.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {course.description}
                  </p>
                )}
              </div>
              <form action={deleteCourse}>
                <input type="hidden" name="id" value={course.id} />
                <ConfirmSubmitButton
                  message="Excluir este curso? Isso não pode ser desfeito."
                  className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Excluir
                </ConfirmSubmitButton>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}