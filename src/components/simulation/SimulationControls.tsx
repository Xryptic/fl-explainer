import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Square, RotateCcw, HelpCircle } from "lucide-react";
import type { FLMode, HyperParams, ClientConfig } from "@/hooks/useSimulationEngine";
import { StepperInput } from "@/components/simulation/StepperInput";

interface SimulationControlsProps {
  mode: FLMode;
  setMode: (m: FLMode) => void;
  numClients: number;
  balanced: boolean;
  updateClients: (count: number, balanced: boolean) => void;
  hyperParams: HyperParams;
  setHyperParams: (h: HyperParams) => void;
  totalRounds: number;
  setTotalRounds: (r: number) => void;
  clients: ClientConfig[];
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function SimulationControls({
  mode,
  setMode,
  numClients,
  balanced,
  updateClients,
  hyperParams,
  setHyperParams,
  totalRounds,
  setTotalRounds,
  clients,
  isRunning,
  onStart,
  onStop,
  onReset,
}: SimulationControlsProps) {
  return (
    <div className="glass-card p-5 space-y-5">
      {/* Mode Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Label className="text-sm font-semibold">FL Mode</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px]">
              <p className="text-xs">
                <strong>Horizontal FL:</strong> Clients share the same feature space but have different data samples (e.g., hospitals with same patient attributes).
              </p>
              <p className="text-xs mt-1">
                <strong>Vertical FL:</strong> Clients share the same samples but hold different features (e.g., bank + retailer for same customers).
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "horizontal" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setMode("horizontal")}
            disabled={isRunning}
          >
            Horizontal FL
          </Button>
          <Button
            variant={mode === "vertical" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setMode("vertical")}
            disabled={isRunning}
          >
            Vertical FL
          </Button>
        </div>
      </div>

      {/* Client Nodes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Client Nodes</Label>
          <span className="text-xs font-mono text-muted-foreground">{numClients}</span>
        </div>
        <Slider
          min={3}
          max={5}
          step={1}
          value={[numClients]}
          onValueChange={([v]) => updateClients(v, balanced)}
          disabled={isRunning}
        />
      </div>

      {/* Data Distribution */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Data Distribution</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{balanced ? "Balanced" : "Skewed"}</span>
            <Switch
              checked={!balanced}
              onCheckedChange={(v) => updateClients(numClients, !v)}
              disabled={isRunning}
            />
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {clients.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: `hsl(${c.color})` }}
              />
              <span className="font-mono">{c.sampleSize.toLocaleString()}</span>
              {c.features && (
                <span className="text-muted-foreground ml-0.5">
                  ({c.features.length} feat.)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hyperparameters */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Hyperparameters</Label>
      <div className="space-y-3">
          <StepperInput
            label="Learning Rate"
            value={hyperParams.learningRate}
            step={0.005}
            min={0.001}
            max={1}
            decimals={3}
            onChange={(v) => setHyperParams({ ...hyperParams, learningRate: v })}
            disabled={isRunning}
          />
          <StepperInput
            label="Local Epochs"
            value={hyperParams.localEpochs}
            step={1}
            min={1}
            max={20}
            decimals={0}
            onChange={(v) => setHyperParams({ ...hyperParams, localEpochs: v })}
            disabled={isRunning}
          />
          <StepperInput
            label="Batch Size"
            value={hyperParams.batchSize}
            step={8}
            min={8}
            max={256}
            decimals={0}
            onChange={(v) => setHyperParams({ ...hyperParams, batchSize: v })}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Rounds */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Total Rounds</Label>
          <span className="text-xs font-mono text-muted-foreground">{totalRounds}</span>
        </div>
        <Slider
          min={5}
          max={30}
          step={1}
          value={[totalRounds]}
          onValueChange={([v]) => setTotalRounds(v)}
          disabled={isRunning}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {!isRunning ? (
          <Button onClick={onStart} className="flex-1 gap-2" size="sm">
            <Play className="w-3.5 h-3.5" />
            Start Simulation
          </Button>
        ) : (
          <Button onClick={onStop} variant="destructive" className="flex-1 gap-2" size="sm">
            <Square className="w-3.5 h-3.5" />
            Stop
          </Button>
        )}
        <Button onClick={onReset} variant="outline" size="sm" disabled={isRunning}>
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
