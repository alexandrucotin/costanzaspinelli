import { ClerkProvider } from "@clerk/nextjs";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout completely bypasses the root layout's ConditionalLayout
  // No navbar or footer, just the sign-in page
  return (
    <html lang="it">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
