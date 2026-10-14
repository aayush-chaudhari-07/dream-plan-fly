import { useState, useRef, useEffect } from "react";
import { Plane, Search, Check } from "lucide-react";
import { searchAirports, type Airport } from "@/shared/constants/airports";
import { cn } from "@/client/lib/utils";

interface AirportComboboxProps {
  value: string; // IATA code
  onChange: (airport: Airport) => void;
  label: string;
  placeholder?: string;
  testId?: string;
}

export function AirportCombobox({
  value,
  onChange,
  label,
  placeholder = "Search city or airport...",
  testId,
}: AirportComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = searchAirports(query, 6);
  const selectedAirport = searchAirports(value, 1)[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(true)}
        className="rounded-2xl border border-border bg-surface px-4 py-2.5 transition-colors focus-within:border-primary hover:border-border/80 cursor-pointer"
        data-testid={testId}
      >
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase block">
          {label}
        </span>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="truncate">
            {selectedAirport ? (
              <span className="font-semibold text-foreground text-sm">
                {selectedAirport.city} ({selectedAirport.iata})
                <span className="text-xs text-muted-foreground block truncate font-normal">
                  {selectedAirport.name}
                </span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <Plane className="size-4 shrink-0 text-muted-foreground" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full min-w-[280px] rounded-2xl border border-border bg-card p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 mb-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city, state, or IATA code..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              data-testid={`${testId}-search-input`}
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1">
            {results.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No airports found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((airport) => {
                const isSelected = airport.iata === value;
                return (
                  <button
                    key={airport.iata}
                    type="button"
                    onClick={() => {
                      onChange(airport);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent text-foreground",
                    )}
                    data-testid={`${testId}-option-${airport.iata}`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{airport.city}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                          {airport.iata}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{airport.name}</p>
                    </div>
                    {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
