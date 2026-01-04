"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HabitWithLogs } from "@/lib/types-habits";
import { logHabit } from "@/app/actions/habits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, startOfDay, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import {
  categoryIcons,
  categoryLabels,
  categoryColors,
} from "@/lib/types-habits";
import { Flame, Trophy, TrendingUp } from "lucide-react";

interface HabitTrackerProps {
  habits: HabitWithLogs[];
}

export function HabitTracker({ habits }: HabitTrackerProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [loading, setLoading] = useState<string | null>(null);

  // Group habits by category
  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, HabitWithLogs[]>);

  // Get log for specific habit and date
  const getLogForDate = (habit: HabitWithLogs, date: Date) => {
    return habit.logs.find((log) => isSameDay(new Date(log.date), date));
  };

  // Handle logging
  const handleLog = async (habitId: string, value: any) => {
    setLoading(habitId);
    try {
      await logHabit({
        habitId,
        date: selectedDate.toISOString(),
        value,
      });
      toast.success("Abitudine registrata!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Errore durante il salvataggio"
      );
    } finally {
      setLoading(null);
    }
  };

  // Calculate today's completion
  const todayLogs = habits.filter((h) => {
    const log = getLogForDate(h, selectedDate);
    if (!log) return false;
    const value = log.value as any;
    return value.completed === true || value.value > 0 || value.rating > 0;
  });
  const completionRate =
    habits.length > 0
      ? Math.round((todayLogs.length / habits.length) * 100)
      : 0;

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-lg font-medium mb-2">
            Nessuna abitudine assegnata
          </h3>
          <p className="text-muted-foreground">
            Il tuo coach ti assegnerà delle abitudini da tracciare
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Completamento Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">
              {todayLogs.length} su {habits.length} completate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Abitudini Attive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{habits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Categorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Object.keys(habitsByCategory).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, "EEEE d MMMM yyyy", { locale: it })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
            {Array.from({ length: 14 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const isSelected = isSameDay(startOfDay(date), selectedDate);
              const isToday = isSameDay(
                startOfDay(date),
                startOfDay(new Date())
              );
              const isPast = date < startOfDay(new Date()) && !isToday;
              const isFuture = date > startOfDay(new Date());

              return (
                <Button
                  key={i}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(startOfDay(date))}
                  className={`flex-1 ${isFuture ? "opacity-50" : ""}`}
                  disabled={isFuture}
                >
                  <div className="text-center w-full">
                    <div className="text-xs">
                      {format(date, "EEE", { locale: it })}
                    </div>
                    <div className="font-bold">{format(date, "d")}</div>
                    {isToday && <div className="text-xs">Oggi</div>}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Habits by Category */}
      <Tabs defaultValue={Object.keys(habitsByCategory)[0]} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {Object.keys(habitsByCategory).map((category) => (
            <TabsTrigger key={category} value={category} className="gap-2">
              <span>
                {categoryIcons[category as keyof typeof categoryIcons]}
              </span>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
          <TabsContent
            key={category}
            value={category}
            className="space-y-4 mt-6"
          >
            {categoryHabits.map((habit) => {
              const log = getLogForDate(habit, selectedDate);
              const logValue = log?.value as any;

              return (
                <Card key={habit.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{habit.icon}</span>
                          <CardTitle className="text-lg">
                            {habit.name}
                          </CardTitle>
                        </div>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {habit.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor:
                            habit.color || categoryColors[habit.category],
                          color: habit.color || categoryColors[habit.category],
                        }}
                      >
                        {habit.frequency === "daily"
                          ? "Giornaliera"
                          : "Settimanale"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Checkbox Type */}
                    {habit.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={habit.id}
                          checked={logValue?.completed === true}
                          onCheckedChange={(checked) =>
                            handleLog(habit.id, { completed: checked === true })
                          }
                          disabled={loading === habit.id}
                        />
                        <label
                          htmlFor={habit.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {logValue?.completed
                            ? "Completata ✓"
                            : "Segna come completata"}
                        </label>
                      </div>
                    )}

                    {/* Number Type */}
                    {habit.type === "number" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Quantità{" "}
                          {habit.target && (
                            <span className="text-muted-foreground">
                              (Obiettivo: {(habit.target as any).value}{" "}
                              {(habit.target as any).unit})
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={logValue?.value || ""}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value)) {
                                handleLog(habit.id, { value });
                              }
                            }}
                            disabled={loading === habit.id}
                            placeholder="0"
                            className="max-w-[200px]"
                          />
                          {habit.target && (
                            <span className="flex items-center text-sm text-muted-foreground">
                              {(habit.target as any).unit}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Scale Type */}
                    {habit.type === "scale" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Valutazione (1-10)
                          </label>
                          <span className="text-2xl font-bold">
                            {logValue?.rating || "-"}
                          </span>
                        </div>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[logValue?.rating || 5]}
                          onValueChange={([value]) =>
                            handleLog(habit.id, { rating: value })
                          }
                          disabled={loading === habit.id}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
