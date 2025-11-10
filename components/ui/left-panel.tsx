"use client";

import React from "react";
import { Bookmark, Menu as MenuIcon, ScanSearch } from "lucide-react";

export default function LeftPanel() {
  const items = [
    { key: "menu", label: "Menu", icon: MenuIcon },
    { key: "bookmarks", label: "Signets", icon: Bookmark },
    { key: "search", label: "Recherche", icon: ScanSearch },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-[9999] w-16 bg-white border-r border-gray-100 shadow-sm">
      <div className="h-full flex flex-col items-center py-3 space-y-3 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div className="justify-center items-center flex flex-col">
              <button
                key={it.key}
                title={it.label}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
                aria-label={it.label}
              >
                <Icon className="h-5 w-5" />
                
              </button>
              <span className="block w-10 truncate text-sm text-center">{it.label}</span>
            </div>
          );
        })}
        <div className="flex-1" />

      
      </div>
    </aside>
  );
}
