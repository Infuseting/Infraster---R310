import React from "react";
import LeafletMap from "../components/ui/leaflet-map";
import UserMenu from "@/components/ui/user-menu";
import LeftPanel from "../components/ui/left-panel";

export default function Home() {
  return (
    <React.Fragment>
      <LeftPanel />

      <LeafletMap />
      <div className="fixed top-4 right-4 z-[9999] pointer-events-auto">
        <UserMenu />
      </div>
    </React.Fragment>
  );
}
