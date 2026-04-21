import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="dash-title">Edit Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}
