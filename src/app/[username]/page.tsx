import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GetUserByUsername, GetUserCreatedGroups } from "@/server/user";
import { CommunityCard } from "@/components/LandingPage/community-card";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// ✅ Skeleton Loader
function ProfileSkeleton() {
  return (
    <div className="h-218 bg-background py-12 px-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* PROFILE SECTION */}
        <div className="flex gap-6 items-start mb-12">
          {/* Avatar Placeholder */}
          <div className="w-44 h-44 rounded-2xl bg-gray-200 dark:bg-slate-800 ring-2 ring-[rgb(224,93,56)]/30 shadow-lg shadow-[rgb(224,93,56)]/10 shrink-0" />

          {/* Text & Stats */}
          <div className="flex flex-col justify-center space-y-3 flex-1 min-w-0">
            <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded-md" />
            <div className="h-5 w-96 bg-gray-200 dark:bg-slate-800 rounded-md" />

            {/* Stats */}
            <div className="flex gap-8 mt-6">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded-md" />
                <div className="h-6 w-10 bg-gray-200 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded-md" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* CREATED GROUPS SECTION */}
        <div>
          {/* Heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded-md" />
            <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded-md" />
          </div>

          {/* Group Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800 h-56"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function UserProfileContent({ username }: { username: string }) {
  const user = await GetUserByUsername(username);
  if (!user) notFound();

  const groups = await GetUserCreatedGroups(user.walletAddress!);

  return (
    <div className="h-218 bg-background py-12 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* PROFILE SECTION */}
        <div className="flex gap-6 items-start mb-12">
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden ring-2 ring-[rgb(224,93,56)]/40 shadow-lg shadow-[rgb(224,93,56)]/20 shrink-0">
            <Image
              src={user.avatar}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3 flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              @{user.username}
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400 leading-snug">
              {user.bio || "Frontend Developer & Web3 Enthusiast"}
            </p>

            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 uppercase font-semibold">
                  Groups Created
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {groups.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 uppercase font-semibold">
                  Joined
                </p>
                <p className="text-lg text-[rgb(224,93,56)] mt-1 font-mono">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CREATED GROUPS SECTION */}
        <div className="transition-all duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-[rgb(224,93,56)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Created Groups
          </h2>

          {groups.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 dark:text-slate-700 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v8m4-4H8m8 4a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                User haven&apos;t created any groups yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {groups.map((group) => (
                <Link
                  key={group.groupId}
                  href={`/group/${group.groupId}`}
                  className="block transition-transform hover:scale-[1.02] duration-300"
                >
                  <CommunityCard
                    name={group.groupName}
                    id={group.groupId}
                    image={group.image || "/default-image.png"}
                    members={group.maxMembers}
                    reviews={10}
                    price={`${group.entryFee} ETH`}
                    description={group.description || "No description provided"}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent username={username} />
    </Suspense>
  );
}
