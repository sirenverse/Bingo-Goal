import { useState, useRef, useEffect } from "react";
import { Check, Circle, Star, Heart, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BingoTile as BingoTileType, MarkerType, Customization } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface BingoTileProps {
  tile: BingoTileType;
  customization: Customization;
  onUpdate: (tile: BingoTileType) => void;
  isExporting?: boolean;
}

const markerIcons: Partial<Record<MarkerType, typeof Check>> = {
  checkmark: Check,
  circle: Circle,
  star: Star,
  heart: Heart,
};

export function BingoTile({ tile, customization, onUpdate, isExporting = false }: BingoTileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tile.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const originalTextRef = useRef(tile.text);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      originalTextRef.current = tile.text;
    }
  }, [isEditing, tile.text]);

  const handleClick = () => {
    if (!tile.text) {
      setIsEditing(true);
      return;
    }
    
    const now = new Date().toISOString();
    onUpdate({
      ...tile,
      completed: !tile.completed,
      completedAt: !tile.completed ? now : null,
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(tile.text);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const trimmedText = editText.trim();
    if (trimmedText !== tile.text) {
      if (trimmedText === "" && tile.text !== "") {
        setEditText(tile.text);
        return;
      }
      onUpdate({
        ...tile,
        text: trimmedText,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setEditText(originalTextRef.current);
      setIsEditing(false);
    }
  };


  const MarkerIcon = markerIcons[customization.markerType] || Check;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const tileBackgroundImage = tile.backgroundImage || customization.tileBackgroundImage;
  const hasGlassEffect = customization.tileGlassEffect === true;
  const markerSize = customization.markerSize ?? 50;
  const markerSizePx = Math.round((markerSize / 50) * 24);
  const markerSizeMdPx = Math.round((markerSize / 50) * 32);

  const tileStyle: React.CSSProperties = {
    backgroundColor: hasGlassEffect ? "rgba(255, 255, 255, 0.15)" : customization.tileBackgroundColor,
    backgroundImage: tileBackgroundImage
      ? `url(${tileBackgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: customization.goalColor || customization.tileTextColor,
    fontFamily: customization.goalFont || "Inter",
    ...(hasGlassEffect && {
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
  };

  const completedStyle: React.CSSProperties = {};

  const hasRoundedCorners = customization.tileCorners === "rounded";
  const cornerClass = hasRoundedCorners ? "rounded-lg" : "rounded-none";

  const canUseMarkerImage = customization.markerType !== "checkmark" && customization.markerImage;

  const tileContent = (
    <div
      className={cn(
        "relative aspect-square flex items-center justify-center p-1 cursor-pointer transition-all duration-200",
        cornerClass,
        !hasGlassEffect && "border border-border/50",
        !isExporting && "hover:shadow-lg hover:-translate-y-0.5",
      )}
      style={{
        ...tileStyle,
        ...completedStyle,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={tile.text || "Empty tile - click to add a goal"}
      data-testid={`tile-${tile.id}`}
    >
      {tileBackgroundImage && (
        <div className={cn("absolute inset-0 bg-black/20", cornerClass)} />
      )}

      {isHovered && !isExporting && !isEditing && (
        <div 
          className="hover-overlay absolute top-0.5 right-0.5 z-30 flex gap-0.5"
          onClick={(e) => e.stopPropagation()}
          style={{ visibility: isHovered ? "visible" : "hidden" }}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-5 w-5 min-h-0"
            onClick={handleEditClick}
            data-testid={`button-edit-${tile.id}`}
          >
            <Pencil className="w-2.5 h-2.5" />
          </Button>
        </div>
      )}

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute inset-1 text-center text-xs font-medium resize-none outline-none focus:ring-2 focus:ring-primary rounded-sm z-10 p-1",
            cornerClass
          )}
          placeholder="Enter goal..."
          style={{ 
            backgroundColor: customization.tileBackgroundColor,
            color: customization.goalColor || customization.tileTextColor,
            fontFamily: customization.goalFont || "Inter",
          }}
          data-testid={`input-tile-${tile.id}`}
        />
      ) : (
        <>
          <span
            className={cn(
              "text-[10px] md:text-xs font-medium text-center break-words line-clamp-3 relative z-10 leading-tight",
              tile.completed && "opacity-60",
            )}
          >
            {tile.text || (
              <span className="opacity-40 italic text-[9px]">Click to add</span>
            )}
          </span>

          {tile.completed && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{ color: customization.markerColor }}
            >
              {canUseMarkerImage ? (
                <div 
                  className="flex items-center justify-center drop-shadow-lg overflow-hidden"
                  style={{
                    width: `${markerSizeMdPx}px`,
                    height: `${markerSizeMdPx}px`,
                    clipPath: customization.markerType === "circle"
                      ? "circle(50%)" 
                      : customization.markerType === "heart"
                      ? "url(#heartClip)"
                      : customization.markerType === "star"
                      ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                      : "circle(50%)",
                  }}
                >
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.9 C0.5,0.9 0.05,0.6 0.05,0.35 C0.05,0.15 0.2,0.05 0.35,0.05 C0.42,0.05 0.47,0.1 0.5,0.15 C0.53,0.1 0.58,0.05 0.65,0.05 C0.8,0.05 0.95,0.15 0.95,0.35 C0.95,0.6 0.5,0.9 0.5,0.9 Z" />
                      </clipPath>
                    </defs>
                  </svg>
                  <img 
                    src={customization.markerImage!} 
                    alt="Custom marker" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <MarkerIcon
                  style={{
                    width: `${markerSizePx}px`,
                    height: `${markerSizePx}px`,
                  }}
                  className="drop-shadow-lg"
                  strokeWidth={3}
                  fill={customization.markerType === "heart" || customization.markerType === "star" || customization.markerType === "circle" ? customization.markerColor : "none"}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  if (tile.completed && tile.completedAt && !isExporting) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {tileContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Completed: {formatDate(tile.completedAt)}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return tileContent;
}
