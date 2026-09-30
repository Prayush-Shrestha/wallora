"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { AIResult } from "@/lib/ai";

interface Uploaded {
  id: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
}

interface Store {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  uploads: Uploaded[];
  addUpload: (u: Uploaded) => void;
  creations: AIResult[];
  addCreation: (c: AIResult) => void;
}

const Ctx = createContext<Store>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  uploads: [],
  addUpload: () => {},
  creations: [],
  addCreation: () => {},
});

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [creations, setCreations] = useState<AIResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read("wallora-favs", []));
    setUploads(read("wallora-uploads", []));
    setCreations(read("wallora-creations", []));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem("wallora-favs", JSON.stringify(favorites)); }, [favorites, ready]);
  useEffect(() => { if (ready) localStorage.setItem("wallora-uploads", JSON.stringify(uploads)); }, [uploads, ready]);
  useEffect(() => { if (ready) localStorage.setItem("wallora-creations", JSON.stringify(creations)); }, [creations, ready]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const addUpload = useCallback((u: Uploaded) => setUploads((p) => [u, ...p]), []);
  const addCreation = useCallback((c: AIResult) => setCreations((p) => [c, ...p]), []);

  return <Ctx.Provider value={{ favorites, toggleFavorite, isFavorite, uploads, addUpload, creations, addCreation }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
