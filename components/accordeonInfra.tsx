import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "../app/dashboard/page"; // adapte selon ton projet
import { formatDate } from "../app/dashboard/page"; // adapte selon ton projet

type Props = {
  infra: {
    id: string;
    name: string;
    type: string;
    address?: string; // ← ici on rend address optionnel
    status: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    piece?: string;
    accessibility?: string;
  };
  onSelect?: (center: [number, number]) => void;
  isOpen?: boolean;
  onToggle?: () => void;
};

export default function AccordeonInfra({
  infra,
  onSelect,
  isOpen,
  onToggle,
}: Props) {
  const handleClick = () => {
    if (
      typeof infra.latitude === "number" &&
      typeof infra.longitude === "number"
    ) {
      onSelect?.([infra.latitude, infra.longitude]);
    }
    onToggle?.();
  };

  return (
    <li
      className="cursor-pointer border border-[#eef2ff] rounded-lg p-3 hover:bg-slate-50 transition"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <strong className="block whitespace-nowrap overflow-hidden text-ellipsis">
            {infra.name}
          </strong>
        </div>

        <div className="text-right flex flex-col items-end">
          <Badge
            variant={
              infra.status === "Ouvert"
                ? "success"
                : infra.status === "Fermé"
                ? "warn"
                : "neutral"
            }
          >
            {infra.status}
          </Badge>
          <div className="text-[12px] text-slate-400 mt-1">
            {formatDate(infra.createdAt)}
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 mt-1" />
          ) : (
            <ChevronDown className="w-4 h-4 mt-1" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 border-t pt-3 text-sm text-slate-700 space-y-2">
          <div>
            <p className="font-semibold text-slate-800">Description</p>
            <p className="text-slate-600">
              {infra.description || "Aucune description disponible."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <p className="font-semibold text-slate-800">Coordonnées :</p>
            <p className="text-slate-600">
              {infra.latitude}, {infra.longitude}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <p className="font-semibold text-slate-800">
              Salle(s) spéciale(s) :
            </p>
            <p className="text-slate-600">{infra.piece || "Aucune"}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <p className="font-semibold text-slate-800">Accessibilité :</p>
            <p className="text-slate-600">
              {infra.accessibility || "Aucune information"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <p className="font-semibold text-slate-800">Type d’équipements :</p>
            <p className="text-slate-600">
              {infra.type || "Aucune information"}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
