"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchLocations } from "@/lib/weather";
import type { LocationResult } from "@/types/weather";

export function CitySelector({ location, onSelect }: { location: LocationResult; onSelect: (location: LocationResult) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setResults(await searchLocations(query, controller.signal));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <Button variant="outline" className="max-w-[230px] justify-start gap-2 bg-white/70 sm:max-w-none" onClick={() => setOpen((value) => !value)}>
        <MapPin className="size-4 text-primary" />
        <span className="truncate">{location.name}{location.admin1 ? `, ${location.admin1}` : ""}</span>
      </Button>

      {open && (
        <div className="absolute left-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border bg-background/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
            <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="도시 이름을 입력하세요" className="pl-9 pr-10" />
            {query && <button className="absolute right-3 top-3 text-muted-foreground" onClick={() => setQuery("")}><X className="size-5" /></button>}
          </div>
          <div className="mt-2 max-h-72 overflow-y-auto">
            {loading && <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />검색 중</div>}
            {!loading && query.length >= 2 && results.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>}
            {!loading && results.map((item) => (
              <button key={`${item.id}-${item.latitude}`} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-muted" onClick={() => { onSelect(item); setOpen(false); setQuery(""); }}>
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{[item.admin1, item.country].filter(Boolean).join(", ")}</span>
                </span>
                {item.id === location.id && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
