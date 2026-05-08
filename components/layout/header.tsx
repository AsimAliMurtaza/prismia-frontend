import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import HeaderClient from "./HeaderClient";

interface HeaderProps {
  title: string;
  description?: string;
}

export async function Header({ title, description }: HeaderProps) {
  const session = await getServerSession(authOptions);

  return (
    <HeaderClient
      title={title}
      description={description}
      session={session}
    />
  );
}