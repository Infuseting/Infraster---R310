import React from "react";
import LeafletMap from "../components/ui/leaflet-map";
import UserMenu from "@/components/ui/user-menu";
import LeftPanel from "../components/ui/left-panel";
import SearchBar from "../components/ui/search-bar";

export default function Home() {
  return (
    <React.Fragment>
      <LeftPanel />

  <SearchBar />

      <LeafletMap />
      <div className="fixed top-4 right-4 z-[9999] pointer-events-auto">
        <UserMenu />
      </div>
    </React.Fragment>
  );
}
