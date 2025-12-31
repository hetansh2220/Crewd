import FeaturedDetails from "@/components/LandingPage/featured-details";
import { GetGroupById } from "@/server/group";
import { notFound } from "next/navigation";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groupData = await GetGroupById(id);

  if (!groupData) {
    notFound();
  }

  return <FeaturedDetails groupData={groupData} />;
}
