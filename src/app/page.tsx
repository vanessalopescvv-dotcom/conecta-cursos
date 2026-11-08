import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Se o utilizador já estiver logado, redireciona para a área dele
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    redirect(profile?.role === "admin" ? "/admin" : "/aluno");
  }

  // Buscar os cursos para a vitrine
  const { data: courses } = await supabase.from("courses").select("*");

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Cabeçalho */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Conecta Cursos
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          Plataforma de Ensino Online
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
          Transforme o seu futuro com os melhores cursos online
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
          Aceda a conteúdos exclusivos, acompanhe os seus módulos e aprenda no seu próprio ritmo numa experiência totalmente moderna.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition-all text-lg"
          >
            Explorar Plataforma
          </Link>
        </div>
      </section>

      {/* Cursos Disponíveis */}
      {courses && courses.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left">
            Cursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col shadow-xl hover:border-slate-600 transition-all"
              >
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
                      Conecta Cursos
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="mt-6 block text-center bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rodapé */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Conecta Cursos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}