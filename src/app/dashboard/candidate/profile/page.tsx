"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { useGetMyProfile } from "@/hooks/user.hook";
import { UserCheck } from "lucide-react";

export default function CandidateProfilePage() {
  const { data: profileData, isLoading } = useGetMyProfile();
  const user = profileData?.data;

  return (
    <RoleGuard allowedRoles={["CANDIDATE"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-emerald-500" />
            <span>Candidate Profile & Skills</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Keep your skills, bio, and portfolio links updated for prospective hiring teams.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading profile information...</div>
        ) : user ? (
          <ProfileSettingsForm user={user} />
        ) : (
          <div className="py-16 text-center text-muted-foreground">Failed to load user profile.</div>
        )}
      </div>
    </RoleGuard>
  );
}
