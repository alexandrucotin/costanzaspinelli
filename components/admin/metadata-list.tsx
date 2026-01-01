"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MetadataItem {
  id: string;
  name: string;
  createdAt: string;
}

interface MetadataListProps {
  items: MetadataItem[];
  title: string;
  onAdd: (name: string) => Promise<MetadataItem>;
  onDelete: (id: string) => Promise<void>;
}

export function MetadataList({
  items: initialItems,
  title,
  onAdd,
  onDelete,
}: MetadataListProps) {
  const [items, setItems] = useState(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newItemName.trim()) {
      toast.error("Inserisci un nome");
      return;
    }

    setIsAdding(true);
    try {
      const newItem = await onAdd(newItemName.trim());
      setItems([...items, newItem]);
      setNewItemName("");
      toast.success(`${title} aggiunto`);
    } catch (error) {
      toast.error("Errore durante l'aggiunta");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${name}"?`)) return;

    try {
      await onDelete(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success(`${title} eliminato`);
    } catch (error) {
      toast.error("Errore durante l'eliminazione");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={`Nome ${title.toLowerCase()}...`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          disabled={isAdding}
        />
        <Button onClick={handleAdd} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nessun {title.toLowerCase()} creato. Inizia aggiungendone uno!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4 flex items-center justify-between">
                <span className="font-medium">{item.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id, item.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
