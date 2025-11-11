"use client";

import React from "react";
import { Bookmark, MagnetIcon, Menu as MenuIcon, ScanSearch } from "lucide-react";

// Component to render recent 'search' type history items (newest -> oldest)
function RecentSearches() {
  const [searches, setSearches] = React.useState<Array<any>>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('recentSearches')
      if (!raw) return
      const arr = JSON.parse(raw)
      const filtered = (arr || []).filter((r: any) => r && r.type === 'search')
      // the history stored by addToHistory places newest items first, so keep order
      setSearches(filtered.slice(0, 10))
    } catch (e) {
      console.warn('failed to load recent searches', e)
    }
  }, [])

  if (!searches || searches.length === 0) {
    return <div className="text-xs text-gray-400 px-2">Aucune recherche récente</div>
  }

  return (
    <div className="w-full px-2">
      {searches.map((s: any, idx: number) => (
        
        <div className="justify-center items-center flex flex-col">
          <button
            key={idx}
            title={s.title}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700"
            aria-label={s.title}
            onClick={() => {
            // emit a custom event with the query so other parts (like SearchBar) may react
            try {
              window.dispatchEvent(new CustomEvent('infraster:searchQuery', { detail: { q: s.title } }))
            } catch (e) {
              console.warn('failed to dispatch searchQuery', e)
            }
          }}
          >
            <MagnetIcon className="h-5 w-5" />
            
          </button>
          <span className="block w-10 truncate text-sm text-center">{s.title}</span>
        </div>
      ))}
    </div>
  )
}

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
        <div className="border-t border-gray-200 w-full " />
        
        <RecentSearches />

        <div className="flex-1" />

      
      </div>
    </aside>
  );
}
