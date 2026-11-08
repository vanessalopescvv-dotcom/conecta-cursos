"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export async function createCourse(formData: FormData) {
	const { supabase } = await requireAdmin();

	const title = String(formData.get("title") ?? "").trim();
	const description = String(formData.get("description") ?? "").trim();
	if (!title) redirect("/admin/cursos?erro=titulo");

	const { error } = await supabase
		.from("courses")
		.insert({ title, description: description || null });

	if (error) redirect("/admin/cursos?erro=criar");

	revalidatePath("/admin/cursos");
	redirect("/admin/cursos");
}

export async function deleteCourse(formData: FormData) {
	const { supabase } = await requireAdmin();

	const id = String(formData.get("id") ?? "");
	if (!id) redirect("/admin/cursos");

	const { error } = await supabase.from("courses").delete().eq("id", id);
	if (error) redirect("/admin/cursos?erro=excluir");

	revalidatePath("/admin/cursos");
	redirect("/admin/cursos");
}
