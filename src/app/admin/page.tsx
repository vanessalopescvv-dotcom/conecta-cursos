import { createServerClient } from "@/lib/supabase/server";
import { createModule, deleteModule, createLesson, deleteLesson } from "./actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminCourseManagePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const courseId = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : undefined;
  const erro = typeof resolvedSearchParams.erro === "string" ? resolvedSearchParams.erro : undefined;
  if (!courseId) {
    redirect("/admin/cursos");
  }

  const supabase = await createServerClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) {
    redirect("/admin/cursos");
  }

  const { data: modules } = await supabase
    .from("modules")
    .select(`
      id,
      title,
      position,
      lessons (
        id,
        title,
        video_url,
        description,
        position
      )
    `)
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/cursos" className="text-sm text-indigo-600 hover:underline mb-1 inline-block">
              ← Voltar para Cursos
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Gerir Curso: {course.title}</h1>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            Ocorreu um erro na operação ({erro}). Tente novamente.
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Novo Módulo</h2>
          <form action={createModule} className="flex gap-3">
            <input type="hidden" name="course_id" value={course.id} />
            <input
              type="text"
              name="title"
              required
              placeholder="Título do Módulo (ex: Módulo 1: Introdução)"
              className="flex-1 rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              Criar Módulo
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Estrutura do Curso</h2>
          
          {!modules || modules.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500">
              Nenhum módulo cadastrado ainda. Crie o primeiro acima!
            </div>
          ) : (
            modules.map((mod: any) => (
              <div key={mod.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-semibold text-gray-900 text-base">📁 {mod.title}</h3>
                  <form action={deleteModule}>
                    <input type="hidden" name="id" value={mod.id} />
                    <input type="hidden" name="course_id" value={course.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline">
                      Excluir Módulo
                    </button>
                  </form>
                </div>

                <div className="pl-4 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aulas</h4>
                  {mod.lessons && mod.lessons.length > 0 ? (
                    mod.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-800">▶ {lesson.title}</p>
                          {lesson.video_url && (
                            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline">
                              Ver vídeo link
                            </a>
                          )}
                        </div>
                        <form action={deleteLesson}>
                          <input type="hidden" name="id" value={lesson.id} />
                          <input type="hidden" name="course_id" value={course.id} />
                          <button type="submit" className="text-xs text-red-500 hover:underline">
                            Excluir
                          </button>
                        </form>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Nenhuma aula neste módulo.</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <form action={createLesson} className="grid gap-3 sm:grid-cols-2">
                    <input type="hidden" name="course_id" value={course.id} />
                    <input type="hidden" name="module_id" value={mod.id} />
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="Título da Aula"
                      className="rounded-lg border border-gray-300 p-2 text-gray-900 text-sm"
                    />
                    <input
                      type="url"
                      name="video_url"
                      placeholder="URL do Vídeo (ex: YouTube)"
                      className="rounded-lg border border-gray-300 p-2 text-gray-900 text-sm"
                    />
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                      >
                        + Adicionar Aula
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}