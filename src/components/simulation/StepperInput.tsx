import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface StepperInputProps {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  decimals: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function StepperInput({
  label,
  value,
  step,
  min,
  max,
  decimals,
  onChange,
  disabled,
}: StepperInputProps) {
  const decrement = () => {
    const next = parseFloat((value - step).toFixed(decimals));
    if (next >= min) onChange(next);
  };

  const increment = () => {
    const next = parseFloat((value + step).toFixed(decimals));
    if (next <= max) onChange(next);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-muted-foreground shrink-0">{label}</label>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={decrement}
          disabled={disabled || value <= min}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-14 text-center text-xs font-mono font-medium">
          {decimals > 0 ? value.toFixed(decimals) : value}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={increment}
          disabled={disabled || value >= max}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
