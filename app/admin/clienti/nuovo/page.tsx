import { ClientForm } from "@/components/admin/client-form";

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nuovo Cliente</h1>
        <p className="text-muted-foreground mt-2">
          Inserisci i dati del nuovo cliente
        </p>
      </div>
      <ClientForm />
    </div>
  );
}
