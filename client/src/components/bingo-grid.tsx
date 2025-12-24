import { forwardRef } from "react";
import { BingoTile } from "./bingo-tile";
import type { BingoTile as BingoTileType, Customization } from "@shared/schema";

interface BingoGridProps {
  tiles: BingoTileType[];
  customization: Customization;
  onTileUpdate: (tile: BingoTileType) => void;
  isExporting?: boolean;
}

export const BingoGrid = forwardRef<HTMLDivElement, BingoGridProps>(
  ({ tiles, customization, onTileUpdate, isExporting = false }, ref) => {
    const columns = customization.columns || 5;
    const spacing = customization.tileSpacing ?? 8;

    const gridStyle: React.CSSProperties = {
      backgroundColor: customization.boardBackgroundColor,
      backgroundImage: customization.boardBackgroundImage
        ? `url(${customization.boardBackgroundImage})`
        : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    const hasRoundedCorners = customization.tileCorners === "rounded";
    const boardCornerClass = hasRoundedCorners ? "rounded-xl" : "rounded-none";

    return (
      <div
        ref={ref}
        className={`relative p-2 md:p-3 ${boardCornerClass}`}
        style={gridStyle}
        data-testid="bingo-grid"
      >
        {customization.boardBackgroundImage && (
          <div className={`absolute inset-0 bg-black/10 ${boardCornerClass}`} />
        )}
        
        <div 
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${spacing}px`,
          }}
        >
          {tiles.map((tile) => (
            <BingoTile
              key={tile.id}
              tile={tile}
              customization={customization}
              onUpdate={onTileUpdate}
              isExporting={isExporting}
            />
          ))}
        </div>
      </div>
    );
  }
);

BingoGrid.displayName = "BingoGrid";
