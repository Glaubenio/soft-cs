import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Metadata } from "next";
import TabBar from "./components/TabBar";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL! || "http://localhost:3000"
  ),
  title: "Soft CS",
  description: ""
};
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);


  if (!session) {
    return redirect("/sign-in");
  }

  const user = session?.user;
  console.log("user", user);
  if (user?.userStatus === "PENDING") {
    return redirect("/pending");
  }

  if (user?.userStatus === "INACTIVE") {
    return redirect("/inactive");
  }

  return (
    <div className="flex h-screen overflow-hidden ">
      <SideBar build={1} />
      <div className="flex flex-col h-full w-full overflow-hidden px-[16px] md:px-0">
        <Header
          id={user.id as string}
          name={user.name as string}
          avatar={user.image as string}
          lang={user.userLanguage as string}
          isAdmin={user.isAdmin}
        />
        <div className="flex-grow overflow-y-auto h-full py-[20px] pr-0 md:pr-[32px] mt-[20px] mb-[87px] md:mb-0">{children}</div>
      </div>
      <TabBar />
    </div>
  );
}
