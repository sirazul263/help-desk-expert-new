import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const user = session?.user
    ? {
        name: session.user.name ?? undefined,
        image: session.user.image ?? undefined,
        role: session.user.role,
      }
    : null;

  return (
    <main>
      <Navbar user={user} />
      {children}
      <Footer />
      <ChatWidget
        userEmail={session?.user?.email ?? undefined}
        userName={session?.user?.name ?? undefined}
      />
    </main>
  );
}
