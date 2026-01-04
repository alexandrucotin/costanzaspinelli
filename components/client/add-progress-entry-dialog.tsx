"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProgressEntry } from "@/app/actions/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface AddProgressEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProgressEntryDialog({
  open,
  onOpenChange,
}: AddProgressEntryDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<{
    front?: { file: File; preview: string };
    side?: { file: File; preview: string };
    back?: { file: File; preview: string };
  }>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  const handlePhotoSelect = (type: "front" | "side" | "back", file: File) => {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato non supportato. Usa JPG, PNG, WebP, HEIC o HEIF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Il file è troppo grande (max 10MB)");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotos((prev) => ({
      ...prev,
      [type]: { file, preview },
    }));
  };

  const handleRemovePhoto = (type: "front" | "side" | "back") => {
    if (photos[type]?.preview) {
      URL.revokeObjectURL(photos[type]!.preview);
    }
    setPhotos((prev) => {
      const newPhotos = { ...prev };
      delete newPhotos[type];
      return newPhotos;
    });
  };

  const uploadPhoto = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload-progress-photo", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Errore durante l'upload");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight && Object.keys(photos).length === 0) {
      toast.error("Inserisci almeno il peso o una foto");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos
      const uploadedPhotos: Array<{
        type: "front" | "side" | "back";
        imageUrl: string;
      }> = [];

      for (const [type, photoData] of Object.entries(photos)) {
        if (photoData) {
          setUploadingPhoto(type);
          const url = await uploadPhoto(photoData.file, type);
          uploadedPhotos.push({
            type: type as "front" | "side" | "back",
            imageUrl: url,
          });
        }
      }

      // Create progress entry
      await createProgressEntry({
        weight: weight ? parseFloat(weight) : undefined,
        notes: notes.trim() || undefined,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
      });

      toast.success("Voce di progresso aggiunta con successo!");

      // Clean up
      Object.values(photos).forEach((photo) => {
        if (photo?.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });

      // Reset form
      setWeight("");
      setNotes("");
      setPhotos({});

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Errore durante il salvataggio"
      );
    } finally {
      setIsSubmitting(false);
      setUploadingPhoto(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Voce di Progresso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="Es. 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <Label>Foto di Progresso (opzionale)</Label>
            <div className="grid grid-cols-3 gap-4">
              {(["front", "side", "back"] as const).map((type) => (
                <div key={type} className="space-y-2">
                  <p className="text-sm font-medium">
                    {type === "front" && "Frontale"}
                    {type === "side" && "Laterale"}
                    {type === "back" && "Posteriore"}
                  </p>
                  {photos[type] ? (
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={photos[type]!.preview}
                        alt={`Foto ${type}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemovePhoto(type)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">
                        Carica foto
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoSelect(type, file);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              placeholder="Aggiungi eventuali note o osservazioni..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          {/* Upload Progress */}
          {uploadingPhoto && (
            <div className="text-sm text-muted-foreground">
              Caricamento foto {uploadingPhoto}...
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
