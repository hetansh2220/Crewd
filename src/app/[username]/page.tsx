import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GetUserByUsername, GetUserCreatedGroups } from "@/server/user";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 dark:border-purple-500/20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 p-8 animate-pulse">
              <div className="w-48 h-48 rounded-2xl bg-gray-200 mx-auto mb-6"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
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
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-purple-400 mb-8 transition-colors group"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 dark:border-purple-500/20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 p-8 shadow-sm hover:shadow-md transition">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden mx-auto mb-6 ring-2 ring-gray-300 dark:ring-purple-500/30">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                @{user.username}
              </h1>

              <p className="text-gray-600 dark:text-slate-400 text-center text-sm mb-6 min-h-[3rem]">
                {user.bio || "Web3 enthusiast"}
              </p>

              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-slate-700/50">
                <p className="text-xs text-gray-500 dark:text-slate-500 mb-2 uppercase font-semibold">
                  Wallet Address
                </p>
                <p className="text-sm font-mono text-purple-600 dark:text-purple-400 truncate">
                  {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase font-semibold">
                    Groups Created
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{groups.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase font-semibold">
                    Joined
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Link
                href="/profile/edit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-purple-500/40"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 dark:border-purple-500/20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/80 p-8 shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
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
                    className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-700 mb-4"
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
                    You haven’t created any groups yet.
                  </p>
                  <Link
                    href="/groups/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-purple-500/50"
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
                <div className="space-y-4">
                  {groups.map((group) => (
                    <Link
                      key={group.groupId}
                      href={`/group/${group.groupId}`}
                      className="block group/card"
                    >
                      <div className="rounded-xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 hover:bg-gray-100 dark:hover:bg-slate-800/60 p-6 transition-all duration-200 hover:border-gray-300 dark:hover:border-purple-500/40 hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600/50">
                            <Image
                              src={group.image}
                              alt={group.groupName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors mb-2 truncate">
                              {group.groupName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-3">
                              {group.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-slate-500">
                              <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800/50 px-3 py-1.5 rounded border border-gray-300 dark:border-slate-700/50">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                  />
                                </svg>
                                {group.maxMembers} max
                              </span>
                              {group.entryFee > 0 && (
                                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800/50 px-3 py-1.5 rounded border border-gray-300 dark:border-slate-700/50 text-purple-600 dark:text-purple-400">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {group.entryFee} ETH
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
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
