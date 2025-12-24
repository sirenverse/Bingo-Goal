import { Check, Circle, Star, Heart, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { MarkerType } from "@shared/schema";

interface MarkerSelectorProps {
  selected: MarkerType;
  color: string;
  markerImage?: string | null;
  onSelect: (marker: MarkerType) => void;
  onImageChange?: (image: string | null) => void;
}

const markers: { type: MarkerType; icon: typeof Check; label: string; filled?: boolean; supportsImage?: boolean }[] = [
  { type: "checkmark", icon: Check, label: "Check", supportsImage: false },
  { type: "circle", icon: Circle, label: "Circle", filled: true, supportsImage: true },
  { type: "star", icon: Star, label: "Star", filled: true, supportsImage: true },
  { type: "heart", icon: Heart, label: "Heart", filled: true, supportsImage: true },
];

export function MarkerSelector({ selected, color, markerImage, onSelect, onImageChange }: MarkerSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const selectedMarker = markers.find(m => m.type === selected);
  const canUseImage = selectedMarker?.supportsImage !== false;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please choose an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange?.(reader.result as string);
      toast({
        title: "Marker image added",
        description: "Your image will be masked to the selected shape.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMarkerSelect = (type: MarkerType) => {
    onSelect(type);
    const marker = markers.find(m => m.type === type);
    if (marker?.supportsImage === false && markerImage) {
      onImageChange?.(null);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Completion Marker Shape</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageUpload}
        className="hidden"
        data-testid="input-marker-image"
      />
      <div className="grid grid-cols-4 gap-2">
        {markers.map(({ type, icon: Icon, label, filled }) => (
          <button
            key={type}
            onClick={() => handleMarkerSelect(type)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md border transition-all",
              "hover-elevate active-elevate-2",
              selected === type
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
            aria-label={label}
            data-testid={`marker-${type}`}
          >
            <Icon
              className="w-5 h-5"
              style={{ color }}
              strokeWidth={2.5}
              fill={filled ? color : "none"}
            />
            <span className="text-[10px] mt-1 text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {canUseImage && (
        <div className="space-y-2">
          <Label className="text-xs">Custom Image (optional)</Label>
          <p className="text-[10px] text-muted-foreground">Upload an image to use as your marker. It will be clipped to the selected shape.</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs"
            >
              <ImagePlus className="w-3 h-3 mr-1" />
              {markerImage ? "Change Image" : "Add Image"}
            </Button>
            {markerImage && (
              <>
                <div className="w-8 h-8 rounded border overflow-hidden">
                  <img src={markerImage} alt="Marker" className="w-full h-full object-cover" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onImageChange?.(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {!canUseImage && (
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
          Custom images are only available for Circle, Star, and Heart markers.
        </div>
      )}
    </div>
  );
}
