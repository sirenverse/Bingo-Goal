import { Separator } from "@/components/ui/separator";
import { MarkerSelector } from "./marker-selector";
import { ColorPicker } from "./color-picker";
import { ImageUpload } from "./image-upload";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Palette, Image, Stamp, Grid3X3, Type, Clock, Square, CircleDot, Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Customization, BingoTile, TileCorner } from "@shared/schema";
import { fontOptions, textAlignments, tileCorners } from "@shared/schema";
import { format } from "date-fns";

interface CustomizationPanelProps {
  customization: Customization;
  onChange: (customization: Customization) => void;
  onGridSizeChange?: (rows: number, columns: number) => void;
  tiles?: BingoTile[];
}

export function CustomizationPanel({ customization, onChange, onGridSizeChange }: CustomizationPanelProps) {
  const [openSections, setOpenSections] = useState({
    board: true,
    colors: false,
    images: false,
    markers: false,
    typography: false,
    deadline: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    customization.deadline ? new Date(customization.deadline) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(
    customization.deadline ? format(new Date(customization.deadline), "HH:mm") : "12:00"
  );

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateField = <K extends keyof Customization>(
    field: K,
    value: Customization[K]
  ) => {
    onChange({ ...customization, [field]: value });
  };

  const handleBoardSizeChange = (preset: string) => {
    let rows = 5, columns = 5;
    if (preset === "3x3") { rows = 3; columns = 3; }
    else if (preset === "4x4") { rows = 4; columns = 4; }
    else if (preset === "5x5") { rows = 5; columns = 5; }
    
    onChange({ ...customization, rows, columns });
    onGridSizeChange?.(rows, columns);
  };

  const handleCustomRowsChange = (rows: number) => {
    onChange({ ...customization, rows });
    onGridSizeChange?.(rows, customization.columns || 5);
  };

  const handleCustomColumnsChange = (columns: number) => {
    onChange({ ...customization, columns });
    onGridSizeChange?.(customization.rows || 5, columns);
  };

  const handleTileCornersChange = (corners: TileCorner) => {
    onChange({ 
      ...customization, 
      tileCorners: corners,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      updateField("deadline", newDate.toISOString());
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      updateField("deadline", newDate.toISOString());
    }
  };

  const handleClearDeadline = () => {
    setSelectedDate(undefined);
    setSelectedTime("12:00");
    setCalendarOpen(false);
    updateField("deadline", null);
  };

  const currentPreset = () => {
    const r = customization.rows || 5;
    const c = customization.columns || 5;
    if (r === 3 && c === 3) return "3x3";
    if (r === 4 && c === 4) return "4x4";
    if (r === 5 && c === 5) return "5x5";
    return "custom";
  };

  return (
    <div className="space-y-3 p-1" data-testid="customization-panel">
      <Collapsible open={openSections.board} onOpenChange={() => toggleSection("board")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Board Size & Layout</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.board ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs">Board Size</Label>
            <div className="flex gap-2 flex-wrap">
              {["3x3", "4x4", "5x5"].map((size) => (
                <Button
                  key={size}
                  variant={currentPreset() === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBoardSizeChange(size)}
                  data-testid={`button-size-${size}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Rows ({customization.rows || 5})</Label>
              <Slider
                value={[customization.rows || 5]}
                min={2}
                max={8}
                step={1}
                onValueChange={([v]) => handleCustomRowsChange(v)}
                data-testid="slider-rows"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Columns ({customization.columns || 5})</Label>
              <Slider
                value={[customization.columns || 5]}
                min={2}
                max={8}
                step={1}
                onValueChange={([v]) => handleCustomColumnsChange(v)}
                data-testid="slider-columns"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tile Spacing ({customization.tileSpacing ?? 8}px)</Label>
            <Slider
              value={[customization.tileSpacing ?? 8]}
              min={0}
              max={20}
              step={1}
              onValueChange={([v]) => updateField("tileSpacing", v)}
              data-testid="slider-spacing"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Tile Corners</Label>
            <div className="flex gap-2">
              <Button
                variant={customization.tileCorners === "square" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTileCornersChange("square")}
                data-testid="button-corners-square"
                className="flex items-center gap-1"
              >
                <Square className="w-4 h-4" />
                Square
              </Button>
              <Button
                variant={customization.tileCorners === "rounded" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTileCornersChange("rounded")}
                data-testid="button-corners-rounded"
                className="flex items-center gap-1"
              >
                <CircleDot className="w-4 h-4" />
                Rounded
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">Glass Effect</Label>
              <p className="text-[10px] text-muted-foreground">Make tiles translucent with blur</p>
            </div>
            <Switch
              checked={customization.tileGlassEffect === true}
              onCheckedChange={(checked) => updateField("tileGlassEffect", checked)}
              data-testid="switch-glass-effect"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.typography} onOpenChange={() => toggleSection("typography")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Title & Text</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.typography ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs">Title Alignment</Label>
            <div className="flex gap-2">
              {textAlignments.map((align) => (
                <Button
                  key={align}
                  variant={customization.titleAlignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateField("titleAlignment", align)}
                  data-testid={`button-align-${align}`}
                  className="capitalize"
                >
                  {align}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Title Font</Label>
            <Select
              value={customization.titleFont || "Inter"}
              onValueChange={(v) => updateField("titleFont", v)}
            >
              <SelectTrigger className="h-8 text-xs" data-testid="select-title-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ColorPicker
            label="Title Color"
            value={customization.titleColor || "#1f2937"}
            onChange={(color) => updateField("titleColor", color)}
            testId="color-title"
          />

          <div className="space-y-1">
            <Label className="text-xs">Goal Text Font</Label>
            <Select
              value={customization.goalFont || "Inter"}
              onValueChange={(v) => updateField("goalFont", v)}
            >
              <SelectTrigger className="h-8 text-xs" data-testid="select-goal-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ColorPicker
            label="Goal Text Color"
            value={customization.goalColor || "#1f2937"}
            onChange={(color) => updateField("goalColor", color)}
            testId="color-goal"
          />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.colors} onOpenChange={() => toggleSection("colors")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Board Colors</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.colors ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <ColorPicker
            label="Board Background"
            value={customization.boardBackgroundColor}
            onChange={(color) => updateField("boardBackgroundColor", color)}
            testId="color-board-bg"
          />
          <ColorPicker
            label="Tile Background"
            value={customization.tileBackgroundColor}
            onChange={(color) => updateField("tileBackgroundColor", color)}
            testId="color-tile-bg"
          />
          <ColorPicker
            label="Marker Color"
            value={customization.markerColor}
            onChange={(color) => updateField("markerColor", color)}
            testId="color-marker"
          />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.images} onOpenChange={() => toggleSection("images")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Background Images</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.images ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <ImageUpload
            label="Board Background"
            value={customization.boardBackgroundImage}
            onChange={(url) => updateField("boardBackgroundImage", url)}
            testId="upload-board-bg"
          />
          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
            Hover over any tile to add individual background images.
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.markers} onOpenChange={() => toggleSection("markers")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Completion Markers</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.markers ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          <MarkerSelector
            selected={customization.markerType}
            color={customization.markerColor}
            markerImage={customization.markerImage}
            onSelect={(type) => updateField("markerType", type)}
            onImageChange={(image) => updateField("markerImage", image)}
          />
          
          <div className="space-y-1">
            <Label className="text-xs">Marker Size ({customization.markerSize || 50}%)</Label>
            <Slider
              value={[customization.markerSize || 50]}
              min={20}
              max={100}
              step={5}
              onValueChange={([v]) => updateField("markerSize", v)}
              data-testid="slider-marker-size"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.deadline} onOpenChange={() => toggleSection("deadline")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover-elevate rounded-md px-2 -mx-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Deadline Timer</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.deadline ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal h-9 text-xs"
                  data-testid="button-choose-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {selectedDate ? format(selectedDate, "PPP") : "Choose Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Label className="text-xs mb-2 block">Time</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-8 text-xs"
                    data-testid="input-deadline-time"
                  />
                </div>
              </PopoverContent>
            </Popover>
            {customization.deadline && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleClearDeadline}
                data-testid="button-clear-deadline"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {customization.deadline && (
            <p className="text-xs text-muted-foreground">
              Deadline: {new Date(customization.deadline).toLocaleString()}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
