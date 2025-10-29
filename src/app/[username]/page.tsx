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

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 dark:border-[rgb(224,93,56)]/20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 p-8 animate-pulse">
            <div className="w-48 h-48 rounded-2xl bg-gray-200 mx-auto mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function UserProfileContent({ username }: { username: string }) {
  const user = await GetUserByUsername(username);

  if (!user) {
    notFound();
  }

  // ✅ Get groups created by this user
  const groups = await GetUserCreatedGroups(user.walletAddress!);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-[rgb(224,93,56)] mb-8 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>

        {/* PROFILE SECTION */}
        <div className="flex gap-6 items-start mb-12">
          {/* Avatar */}
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden ring-2 ring-[rgb(224,93,56)]/40 shadow-lg shadow-[rgb(224,93,56)]/20 flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>

          {/* Username & Bio */}
          <div className="flex flex-col justify-center space-y-3 flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">@{user.username}</h1>
            <p className="text-lg text-gray-600 dark:text-slate-400 leading-snug">{user.bio || "Frontend Developer & Web3 Enthusiast"}</p>

            {/* Stats Section */}
            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 uppercase font-semibold">Groups Created</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{groups.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 uppercase font-semibold">Joined</p>
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
              <p className="text-gray-600 dark:text-slate-400 mb-6">You haven&apos;t created any groups yet.</p>
              <Link
                href="/groups/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[rgb(224,93,56)] to-[rgb(244,113,76)] hover:from-[rgb(244,113,76)] hover:to-[rgb(224,93,56)] text-white font-semibold rounded-xl shadow-md hover:shadow-[rgb(224,93,56)]/40 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Group
              </Link>
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
                    image={group.image || "/default-image.png"}
                    members={group.maxMembers}
                    rating={5}
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