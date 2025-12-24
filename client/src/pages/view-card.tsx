import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Share2, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { BingoGrid } from "@/components/bingo-grid";
import { ShareModal } from "@/components/share-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import type { BingoCard, BingoTile } from "@shared/schema";

export default function ViewCard() {
  const { id } = useParams<{ id: string }>();
  const [shareOpen, setShareOpen] = useState(false);
  const [localTiles, setLocalTiles] = useState<BingoTile[] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: card, isLoading, error } = useQuery<BingoCard>({
    queryKey: ["/api/cards", id],
  });

  const displayTiles = localTiles ?? card?.tiles ?? [];

  const updateMutation = useMutation({
    mutationFn: async (tiles: BingoTile[]) => {
      return apiRequest("PATCH", `/api/cards/${id}`, { tiles });
    },
    onSuccess: async (response) => {
      const data: BingoCard = await response.json();
      queryClient.setQueryData(["/api/cards", id], data);
      setLocalTiles(null);
    },
    onError: () => {
      setLocalTiles(null);
      toast({
        title: "Update failed",
        description: "There was an error saving your progress.",
        variant: "destructive",
      });
    },
  });

  const handleTileUpdate = (updatedTile: BingoTile) => {
    if (!card) return;
    const newTiles = (localTiles ?? card.tiles).map((tile) =>
      tile.id === updatedTile.id ? updatedTile : tile
    );
    setLocalTiles(newTiles);
    updateMutation.mutate(newTiles);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your bingo card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="error-state">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Card not found</h1>
          <p className="text-muted-foreground">
            This bingo card doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button data-testid="button-create-new">
              <Home className="w-4 h-4 mr-2" />
              Create your own
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = displayTiles.filter((t) => t.completed).length;
  const goalCount = displayTiles.filter((t) => t.text.trim()).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent cursor-pointer" data-testid="link-home">
                Goal Bingo
              </span>
            </Link>
            {goalCount > 0 && (
              <span className="text-xs md:text-sm text-muted-foreground" data-testid="text-progress">
                {completedCount}/{goalCount} completed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShareOpen(true)}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-6" data-testid="text-card-title">
            {card.title}
          </h1>

          <Card className="p-2 md:p-4">
            <BingoGrid
              ref={gridRef}
              tiles={displayTiles}
              customization={card.customization}
              onTileUpdate={handleTileUpdate}
            />
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Click on goals to mark them as complete!</p>
          </div>
        </div>
      </main>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        cardId={id || null}
        gridRef={gridRef}
      />
    </div>
  );
}
