"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const STORAGE_KEY = "leftPanelOpen";

export default function LeftPanel() {
  const [open, setOpen] = useState<boolean>(false);

  // Read initial state from localStorage on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      setOpen(v === "true");
    } catch (e) {
      // ignore (e.g., SSR safety)
    }
  }, []);

  // Persist state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, open ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }, [open]);

  return (
    <>
      {/* Toggle button fixed top-left */}
      <div className="fixed top-4 left-4 z-[9999]">
        <button
          aria-expanded={open}
          aria-controls="left-panel"
          aria-label={open ? "Fermer le panneau" : "Ouvrir le panneau"}
          onClick={() => setOpen(!open)}
          className="bg-white border border-gray-200 rounded p-2 shadow hover:bg-gray-50 focus:outline-none"
        >
          {/* Use lucide-react icons */}
          {open ? (
            <X className="h-5 w-5 text-gray-700" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Scrim behind panel when open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Left panel */}
      <aside
        id="left-panel"
        className={`fixed inset-y-0 left-0 z-[9999] w-80 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Panneau</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le panneau"
            className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          >
            <X className="h-4 w-4 text-gray-600" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500">Ici vous pourrez ajouter des informations plus tard.</p>
          {/* Placeholder content */}
        </div>
      </aside>
    </>
  );
}
