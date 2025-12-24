import { useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  testId?: string;
}

export function ImageUpload({ label, value, onChange, testId }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onChange(reader.result as string);
      toast({
        title: "Image uploaded",
        description: "Your background image has been added.",
      });
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "There was an error reading the image. Please try again.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    toast({
      title: "Image removed",
      description: "Background image has been cleared.",
    });
  };

  const id = testId || `image-upload-${label.toLowerCase().replace(/\s/g, "-")}`;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        data-testid={id}
      />
      
      {value ? (
        <div className="relative w-full h-24 rounded-md overflow-hidden border border-border">
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={handleClear}
            data-testid={`button-clear-${id}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full h-24 rounded-md border-2 border-dashed border-border",
            "flex flex-col items-center justify-center gap-2",
            "text-muted-foreground text-sm",
            "hover-elevate active-elevate-2 transition-colors cursor-pointer",
            "bg-muted/30"
          )}
          data-testid={`button-${id}`}
        >
          <ImageIcon className="w-6 h-6" />
          <span>Click to upload</span>
          <span className="text-xs opacity-60">JPG, PNG, max 2MB</span>
        </button>
      )}
    </div>
  );
}
