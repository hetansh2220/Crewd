import { redirect } from "next/navigation";

export default function SettingsPage() {
  // When someone visits /settings, immediately go to /settings/profile
  redirect("/settings/profile");
}
