import { auth } from "@/lib/auth"; // adjust the import path as needed
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // If the logged-in user is not admin, redirect to forbidden page
  // if (!session || !session.user || session.user.role !== "admin") {
  //     redirect("/en/forbidden");
  // }

  return <div>{children}</div>;
}
