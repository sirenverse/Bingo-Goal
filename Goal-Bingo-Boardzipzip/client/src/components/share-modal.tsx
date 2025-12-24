import { useState } from "react";
import { toPng } from "html-to-image";
import { Download, Link2, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string | null;
  gridRef: React.RefObject<HTMLDivElement | null>;
  isSaving?: boolean;
  onSaveFirst?: () => Promise<void>;
}

export function ShareModal({ open, onOpenChange, cardId, gridRef, isSaving = false, onSaveFirst }: ShareModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = cardId ? `${window.location.origin}/card/${cardId}` : "";

  const handleDownload = async () => {
    if (!gridRef.current) {
      toast({
        title: "Download failed",
        description: "Unable to find the bingo grid. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const element = gridRef.current;
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        includeQueryParams: true,
        skipAutoScale: false,
        filter: (node) => {
          if (node.classList?.contains("hover-overlay")) return false;
          return true;
        },
        style: {
          transform: "none",
          boxShadow: "none",
        },
      });

      const link = document.createElement("a");
      link.download = "goal-bingo.png";
      link.href = dataUrl;
      link.click();

      toast({
        title: "Downloaded!",
        description: "Your bingo card has been saved as an image.",
      });
    } catch (error) {
      console.error("Failed to download:", error);
      toast({
        title: "Download failed",
        description: "There was an error creating the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!cardId && onSaveFirst) {
      toast({
        title: "Saving your card...",
        description: "Please wait while we generate a shareable link.",
      });
      try {
        await onSaveFirst();
      } catch {
        toast({
          title: "Save failed",
          description: "Please remove some background images and try again (images are too large).",
          variant: "destructive",
        });
      }
      return;
    }
    
    if (!shareUrl) {
      toast({
        title: "Save your card first",
        description: "Create some goals and save your card to get a shareable link.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with friends to show them your goals.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the link from the input field.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="share-modal">
        <DialogHeader>
          <DialogTitle>Share Your Bingo Card</DialogTitle>
          <DialogDescription>
            Download your card as an image or share a link with friends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleDownload}
            disabled={isDownloading || isSaving}
            data-testid="button-download"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? "Creating image..." : "Download as Image"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or share a link
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={shareUrl || "Save your card to get a shareable link"}
              readOnly
              className="flex-1 text-sm"
              data-testid="input-share-url"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              disabled={isSaving}
              data-testid="button-copy-link"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Note: Large background images may prevent sharing. Use the download option for full quality exports.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
