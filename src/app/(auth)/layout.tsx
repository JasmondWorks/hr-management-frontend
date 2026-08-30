import { BrandLogo } from "@/shared/ui/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-12 flex justify-center">
          <BrandLogo className="w-[180px] text-primary" variant="filled" />
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
