import FeaturedDetails from "@/components/LandingPage/FeaturedDetails";
import { GetGroupById } from "@/server/group";
import { notFound } from "next/navigation";

export default async function GroupPage({ params }: { params: { id: string } }) {
  const groupData = await GetGroupById(params.id);

  if (!groupData) {
    notFound();
  }

  return <FeaturedDetails groupData={groupData} />;
}
