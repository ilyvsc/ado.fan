import { redirect } from "next/navigation";

export default function AdminPanelIndex() {
  redirect("/admin/songs");
}
