"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

function back(courseId: string, erro?: string): never {
  redirect(`/admin/curso?id=${courseId}${erro ? `&erro=${erro}` : ""}`);
}

export async function createModule(formData: FormData) {
  const { supabase } = await requireAdmin();

  const courseId = String(formData.get("course_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!courseId) redirect("/admin/cursos");
  if (!title) back(courseId, "titulo");

  const { data: last } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (last?.[0]?.position ?? 0) + 1;

  const { error } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title, position });
  if (error) back(courseId, "modulo");

  revalidatePath("/admin/curso");
  back(courseId);
}

export async function deleteModule(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const courseId = String(formData.get("course_id") ?? "");
  if (!id || !courseId) redirect("/admin/cursos");

  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) back(courseId, "excluir");

  revalidatePath("/admin/curso");
  back(courseId);
}

export async function createLesson(formData: FormData) {
  const { supabase } = await requireAdmin();

  const courseId = String(formData.get("course_id") ?? "");
  const moduleId = String(formData.get("module_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!courseId || !moduleId) redirect("/admin/cursos");
  if (!title) back(courseId, "titulo");

  const { data: last } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (last?.[0]?.position ?? 0) + 1;

  const { error } = await supabase.from("lessons").insert({
    module_id: moduleId,
    title,
    video_url: videoUrl || null,
    description: description || null,
    position,
  });
  if (error) back(courseId, "aula");

  revalidatePath("/admin/curso");
  back(courseId);
}

export async function deleteLesson(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const courseId = String(formData.get("course_id") ?? "");
  if (!id || !courseId) redirect("/admin/cursos");

  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) back(courseId, "excluir");

  revalidatePath("/admin/curso");
  back(courseId);
}