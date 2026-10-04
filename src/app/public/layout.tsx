import { PublicHeader } from "@/components/layout/public/Header";
import { PublicFooter } from "@/components/layout/public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#090d16]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
