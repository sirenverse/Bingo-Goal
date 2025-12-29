import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Share2, RotateCcw, Save, Loader2, Settings2, Plus, ChevronDown, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BingoGrid } from "@/components/bingo-grid";
import { CustomizationPanel } from "@/components/customization-panel";
import { ShareModal } from "@/components/share-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BingoTile,
  type Customization,
  type BingoCard,
  createEmptyTiles,
  defaultCustomization,
} from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeadlineTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <Badge variant={isExpired ? "destructive" : "secondary"} className="gap-1 text-xs">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </Badge>
  );
}

export default function Home() {
  const [title, setTitle] = useState("My Goal Bingo");
  const [tiles, setTiles] = useState<BingoTile[]>(createEmptyTiles());
  const [customization, setCustomization] = useState<Customization>(defaultCustomization);
  const [cardId, setCardId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: savedCards = [] } = useQuery<BingoCard[]>({
    queryKey: ["/api/cards"],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { title, tiles, customization };
      if (cardId) {
        return apiRequest("PATCH", `/api/cards/${cardId}`, data);
      }
      return apiRequest("POST", "/api/cards", data);
    },
    onSuccess: async (response) => {
      const data: BingoCard = await response.json();
      setCardId(data.id);
      setTitle(data.title);
      setTiles(data.tiles);
      setCustomization(data.customization);
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Saved!",
        description: "Your bingo card has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "There was an error saving your card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Deleted",
        description: "Card has been removed.",
      });
    },
  });

  const handleTileUpdate = useCallback((updatedTile: BingoTile) => {
    setTiles((prev) =>
      prev.map((tile) => (tile.id === updatedTile.id ? updatedTile : tile))
    );
  }, []);

  const handleGridSizeChange = useCallback((rows: number, columns: number) => {
    const newTileCount = rows * columns;
    setTiles((prev) => {
      if (prev.length === newTileCount) return prev;
      
      const newTiles: BingoTile[] = [];
      for (let i = 0; i < newTileCount; i++) {
        if (prev[i]) {
          newTiles.push({ ...prev[i], id: i });
        } else {
          newTiles.push({
            id: i,
            text: "",
            completed: false,
            completedAt: null,
            backgroundImage: null,
          });
        }
      }
      return newTiles;
    });
  }, []);

  const handleReset = () => {
    const rows = customization.rows || 5;
    const columns = customization.columns || 5;
    setTitle("My Goal Bingo");
    setTiles(createEmptyTiles(rows, columns));
    setCustomization(defaultCustomization);
    setCardId(null);
    toast({
      title: "Card reset",
      description: "Your bingo card has been cleared.",
    });
  };

  const handleNewBoard = () => {
    setTitle("My Goal Bingo");
    setTiles(createEmptyTiles(5, 5));
    setCustomization(defaultCustomization);
    setCardId(null);
  };

  const handleLoadCard = (card: BingoCard) => {
    setCardId(card.id);
    setTitle(card.title);
    setTiles(card.tiles);
    setCustomization({ ...defaultCustomization, ...card.customization });
  };

  const handleSaveFirst = async () => {
    await saveMutation.mutateAsync();
  };

  const completedCount = tiles.filter((t) => t.completed).length;
  const goalCount = tiles.filter((t) => t.text.trim()).length;

  useEffect(() => {
    const handleTileImageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ tileId: number; image: string | null }>;
      const { tileId, image } = customEvent.detail;
      setTiles((prev) =>
        prev.map((tile) =>
          tile.id === tileId ? { ...tile, backgroundImage: image } : tile
        )
      );
    };

    window.addEventListener("tileImageUpdate", handleTileImageUpdate);
    return () =>
      window.removeEventListener("tileImageUpdate", handleTileImageUpdate);
  }, []);

  const titleStyle: React.CSSProperties = {
    textAlign: customization.titleAlignment || "center",
    fontFamily: customization.titleFont || "Inter",
    color: customization.titleColor || "#ffffff",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent" data-testid="text-logo">
              Goal Bingo
            </h1>
            {goalCount > 0 && (
              <span className="text-xs text-muted-foreground" data-testid="text-progress">
                {completedCount}/{goalCount}
              </span>
            )}
            {customization.deadline && (
              <DeadlineTimer deadline={customization.deadline} />
            )}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-customize">
                  <Settings2 className="w-4 h-4 md:mr-1" />
                  <span className="hidden md:inline">Customize</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]" data-testid="sheet-customize">
                <SheetHeader>
                  <SheetTitle>Customize Your Board</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                  <CustomizationPanel
                    customization={customization}
                    onChange={setCustomization}
                    onGridSizeChange={handleGridSizeChange}
                    tiles={tiles}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-boards">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-testid="dropdown-boards">
                <DropdownMenuItem onClick={handleNewBoard} data-testid="button-new-board">
                  <Plus className="w-4 h-4 mr-2" />
                  New Board
                </DropdownMenuItem>
                {savedCards.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {savedCards.map((card) => (
                      <DropdownMenuItem 
                        key={card.id}
                        className="flex items-center justify-between gap-2"
                        data-testid={`board-item-${card.id}`}
                      >
                        <span 
                          className="truncate flex-1 cursor-pointer"
                          onClick={() => handleLoadCard(card)}
                        >
                          {card.title}
                        </span>
                        {card.id !== cardId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 min-h-0 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(card.id);
                            }}
                            data-testid={`button-delete-${card.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              data-testid="button-save"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 md:mr-1" />
              )}
              <span className="hidden md:inline">{saveMutation.isPending ? "Saving..." : "Save"}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShareOpen(true)}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Share</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-reset">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-testid="dialog-reset">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset your bingo card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your goals and customizations. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} data-testid="button-confirm-reset">
                    Reset Card
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 py-3">
        <div className="max-w-md mx-auto">
          <div className="mb-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg md:text-xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
              placeholder="Enter your card title..."
              style={titleStyle}
              data-testid="input-title"
            />
          </div>

          <Card className="p-1.5 md:p-2">
            <BingoGrid
              ref={gridRef}
              tiles={tiles}
              customization={customization}
              onTileUpdate={handleTileUpdate}
            />
          </Card>

          <p className="mt-2 text-center text-xs text-muted-foreground" data-testid="text-instructions">
            Hover over a tile to edit or add an image. Click to mark complete.
          </p>
        </div>
      </main>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        cardId={cardId}
        gridRef={gridRef}
        isSaving={saveMutation.isPending}
        onSaveFirst={handleSaveFirst}
      />
    </div>
  );
}
