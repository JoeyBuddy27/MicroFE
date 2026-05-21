// src/SearchWidget.tsx
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";

type Props = {
  brand?: string;
};

type SearchState = {
  query: string;
  filters: string[];
  source: "gb-search-widget";
  version: "1.0.0";
};

const FILTER_OPTIONS = ["Any Price", "Weekend", "18 Holes", "Top Rated"];
const SESSION_KEY = "gb-search-widget-state";

export function SearchWidget({ brand = "Golfbreaks" }: Props) {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const state: SearchState = useMemo(
    () => ({
      query,
      filters: selectedFilters,
      source: "gb-search-widget",
      version: "1.0.0",
    }),
    [query, selectedFilters],
  );

  const syncToBrowserState = (nextState: SearchState) => {
    const url = new URL(window.location.href);

    if (nextState.query.trim()) {
      url.searchParams.set("query", nextState.query.trim());
    } else {
      url.searchParams.delete("query");
    }

    if (nextState.filters.length > 0) {
      url.searchParams.set("filters", nextState.filters.join(","));
    } else {
      url.searchParams.delete("filters");
    }

    window.history.replaceState({}, "", url);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextState));

    window.dispatchEvent(
      new CustomEvent("gb-search-widget-state-change", {
        detail: nextState,
      }),
    );

    window.dispatchEvent(
      new CustomEvent("gb-search-state", {
        detail: nextState,
      }),
    );
  };

  function search() {
    const nextState: SearchState = {
      query,
      filters: selectedFilters,
      source: "gb-search-widget",
      version: "1.0.0",
    };

    window.dispatchEvent(
      new CustomEvent("gb-search", {
        detail: nextState,
      }),
    );

    syncToBrowserState(nextState);
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((item) => item !== filter);
      }
      return [...prev, filter];
    });
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const initialQuery = url.searchParams.get("query") ?? "";
    const initialFilters = (url.searchParams.get("filters") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (initialQuery) {
      setQuery(initialQuery);
    }

    if (initialFilters.length > 0) {
      setSelectedFilters(initialFilters);
      return;
    }

    const persistedState = sessionStorage.getItem(SESSION_KEY);
    if (!persistedState) return;

    try {
      const parsed = JSON.parse(persistedState) as Partial<SearchState>;
      if (typeof parsed.query === "string") setQuery(parsed.query);
      if (Array.isArray(parsed.filters)) {
        setSelectedFilters(
          parsed.filters.filter((item) => typeof item === "string"),
        );
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    syncToBrowserState(state);
  }, [state]);

  return (
    <Box sx={{ margin: 3 }}>
      <Typography variant="h3">{brand} Search </Typography>
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Where do you want to play?"
        fullWidth
        margin="normal"
      />

      <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2 }}>
        {FILTER_OPTIONS.map((filter) => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <Chip
              key={filter}
              label={filter}
              clickable
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              onClick={() => toggleFilter(filter)}
            />
          );
        })}
      </Stack>

      <Button variant="contained" color="primary" onClick={search}>
        Search
      </Button>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        You have searched for: <strong>{query || "(nothing yet)"}</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
        Active filters: <strong>{selectedFilters.join(", ") || "None"}</strong>
      </Typography>
    </Box>
  );
}
