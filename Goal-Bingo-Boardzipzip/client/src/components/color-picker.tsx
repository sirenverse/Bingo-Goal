import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  testId?: string;
}

export function ColorPicker({ label, value, onChange, testId }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-md border border-border overflow-hidden flex-shrink-0"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 -m-1 cursor-pointer"
            data-testid={testId || `color-picker-${label.toLowerCase().replace(/\s/g, "-")}`}
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}
