import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Area Riservata</h1>
          <p className="text-muted-foreground">
            Accedi per gestire schede ed esercizi
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-sm normal-case",
              card: "shadow-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white hover:bg-gray-50 border border-gray-300",
              formFieldInput: "rounded-lg",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
        />
      </div>
    </div>
  );
}
