"use client";

import { Button } from "@/components/ui/button";
import { GetGroups } from "@/server/group";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { CommunityCard } from "./community-card";
interface Group {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  maxMembers: number;
  entryFee: string;
}

export function FeaturedSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch groups using server action
  useEffect(() => {
    (async () => {
      setLoading(true); // ✅ Start loading before fetch
      try {
        const data = await GetGroups();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    })();
  }, []);


  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };



  return (
    <section className="m-2 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground truncate">
            Featured
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">
            This week&#39;s curated groups
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button onClick={() => scroll("left")} size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <CaretLeftIcon size={16} />
          </Button>
          <Button onClick={() => scroll("right")} size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <CaretRightIcon size={16} />
          </Button>
          <Button variant="link" className="text-sm sm:text-md px-1 sm:px-2 whitespace-nowrap">
            See All
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {loading ? (
          // skeletons
          [...Array(3)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
              <Skeleton className="h-[200px] w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
              <Skeleton className="h-4 w-1/2 rounded-lg mb-2" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))
        ) : (
          groups.map((group, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/group/${group.id}`)}
            >
              <CommunityCard
                name={group.name}
                image={group.image || "/default-image.png"}
                members={group.maxMembers}
                rating={5}
                reviews={10}
                price={`${group.entryFee} SOL`}
                description={group.description || "No description provided"}
              />
            </div>
          ))
        )}


      </div>

    </section>
  );
}
