"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactAction } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(1, "Nome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, "Il messaggio deve essere di almeno 10 caratteri"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactAction(data);
      toast.success("Messaggio inviato! Ti risponderò al più presto.");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Errore nell'invio del messaggio. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Grazie per avermi contattato!
        </h2>
        <p className="text-muted-foreground mb-6">
          Ho ricevuto il tuo messaggio e ti risponderò entro 24 ore.
        </p>
        <Button onClick={() => setSubmitted(false)}>
          Invia un altro messaggio
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" {...register("name")} placeholder="Mario Rossi" />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="mario@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Telefono (opzionale)</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="+39 123 456 7890"
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Messaggio *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Raccontami i tuoi obiettivi e come posso aiutarti..."
          rows={6}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Invio in corso..." : "Invia Messaggio"}
      </Button>
    </form>
  );
}
