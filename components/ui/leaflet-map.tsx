"use client";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./leaflet-map.client"), { ssr: false });

export default LeafletMap;
