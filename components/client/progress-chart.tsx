"use client";

import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressChartProps {
  data: Array<{ weight: number; date: Date }>;
  targetWeight?: number;
}

export function ProgressChart({ data, targetWeight }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nessun dato disponibile
      </div>
    );
  }

  // Prepare chart data
  const chartData = data.map((d) => ({
    date: format(d.date, "d MMM", { locale: it }),
    fullDate: format(d.date, "d MMMM yyyy", { locale: it }),
    weight: d.weight,
  }));

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  // Calculate Y-axis domain (round to nearest 5kg)
  const allValues = targetWeight ? [...weights, targetWeight] : weights;
  const absoluteMin = Math.min(...allValues);
  const absoluteMax = Math.max(...allValues);

  const yMin = Math.floor(absoluteMin / 5) * 5 - 5;
  const yMax = Math.ceil(absoluteMax / 5) * 5 + 5;

  // Chart configuration
  const chartConfig = {
    weight: {
      label: "Peso",
      color: "#a13842",
    },
  };

  return (
    <div className="w-full space-y-4">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[yMin, yMax]}
            ticks={Array.from(
              { length: Math.floor((yMax - yMin) / 5) + 1 },
              (_, i) => yMin + i * 5
            )}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value} kg`}
          />
          {targetWeight && (
            <ReferenceLine
              y={targetWeight}
              stroke="#a1384280"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Target: ${targetWeight.toFixed(1)} kg`,
                position: "insideTopLeft",
                fill: "#a13842",
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}
          <Bar
            dataKey="weight"
            fill="#a13842"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ChartContainer>

      {/* Y-axis labels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
        <div>
          <span className="text-muted-foreground">Min: </span>
          <span className="font-semibold">{minWeight.toFixed(1)} kg</span>
        </div>
        <div>
          <span className="text-muted-foreground">Max: </span>
          <span className="font-semibold">{maxWeight.toFixed(1)} kg</span>
        </div>
        <div>
          <span className="text-muted-foreground">Variazione: </span>
          <span className="font-semibold">
            {(maxWeight - minWeight).toFixed(1)} kg
          </span>
        </div>
        {targetWeight && (
          <div>
            <span className="text-muted-foreground">Dal Target: </span>
            <span
              className={`font-semibold ${
                weights[weights.length - 1] > targetWeight
                  ? "text-orange-600"
                  : weights[weights.length - 1] < targetWeight
                  ? "text-green-600"
                  : "text-primary"
              }`}
            >
              {weights[weights.length - 1] > targetWeight ? "+" : ""}
              {(weights[weights.length - 1] - targetWeight).toFixed(1)} kg
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
