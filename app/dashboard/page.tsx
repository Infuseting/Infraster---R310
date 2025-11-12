"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";

/* Types */
type InfrastructureType = "Route" | "Eau" | "Eclairage" | "Batiment" | "Autre";

export type Infrastructure = {
  id: string;
  name: string;
  type: InfrastructureType;
  address?: string;
  status: "Ouvert" | "Fermé" | "Plein";
  createdAt: string; // ISO
  latitude?: number;
  longitude?: number;
  description?: string;
};

/* Utils */
const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });

/* Mock API (replace with real API calls) */
const initialMockData = (): Infrastructure[] => [
  {
    id: uid("i_"),
    name: "Test",
    type: "Eau",
    address: "Rue des Sources, 14000 Caen",
    status: "Ouvert",
    createdAt: new Date().toISOString(),
    latitude: 49.182863,
    longitude: -0.370679,
    description: "test description",
  },
  {
    id: uid("i_"),
    name: "Pont de test",
    type: "Route",
    address: "Avenue du Pont",
    status: "Fermé",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    latitude: 49.1835,
    longitude: -0.3702,
    description: "Gros pont",
  },
];

const mockFetchInfrastructures = async (): Promise<Infrastructure[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return initialMockData();
};

const mockCreateInfrastructure = async (
  payload: Omit<Infrastructure, "id" | "createdAt">
): Promise<Infrastructure> => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...payload,
    id: uid("i_"),
    createdAt: new Date().toISOString(),
  };
};

/* Small UI primitives */
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warn";
}> = ({ children, variant = "neutral" }) => {
  const bg =
    variant === "success"
      ? "#d1fae5"
      : variant === "warn"
      ? "#fff4e5"
      : "#eef2ff";
  const color = variant === "warn" ? "#92400e" : "#0f172a";
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "4px 8px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};

/* Dashboard Page */
export default function DashboardPage(): JSX.Element {
  const [items, setItems] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* UI state */
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<InfrastructureType | "All">(
    "All"
  );
  const [statusFilter, setStatusFilter] = useState<
    "All" | Infrastructure["status"]
  >("All");
  const [page, setPage] = useState(1);
  const perPage = 6;

  /* Modal/Form state */
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    mockFetchInfrastructures()
      .then((data) => setItems(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  /* Derived data (search + filters) */
  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (typeFilter !== "All" && it.type !== typeFilter) return false;
      if (statusFilter !== "All" && it.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        (it.address || "").toLowerCase().includes(q) ||
        (it.description || "").toLowerCase().includes(q)
      );
    });
  }, [items, query, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* Pagination slice */
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* Handlers */
  const handleCreate = async (
    payload: Omit<Infrastructure, "id" | "createdAt">
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await mockCreateInfrastructure(payload);
      setItems((s) => [created, ...s]);
      setShowForm(false);
      setPage(1);
    } catch (e) {
      setError("Impossible de créer l'infrastructure");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Inter, Roboto, system-ui, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Tableau de bord des infrastructures</h2>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            Voir, filtrer et ajouter des infrastructures de la collectivité
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "#0ea5a4",
              color: "white",
              border: "none",
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Ajouter une infrastructure
          </button>
        </div>
      </header>

      <main
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 18,
        }}
      >
        {/* Left: List */}
        <section style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <input
              aria-label="Recherche"
              placeholder="Rechercher par nom, adresse, description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e6e9ef",
              }}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              style={{ padding: 8, borderRadius: 8 }}
            >
              <option value="All">Tous types</option>
              <option value="Route">Route</option>
              <option value="Eau">Eau</option>
              <option value="Eclairage">Eclairage</option>
              <option value="Batiment">Bâtiment</option>
              <option value="Autre">Autre</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{ padding: 8, borderRadius: 8 }}
            >
              <option value="All">Tous statuts</option>
              <option value="Ouvert">Ouvert</option>
              <option value="Fermé">Fermé</option>
              <option value="Plein">Plein</option>
            </select>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
              padding: 12,
            }}
          >
            {loading ? (
              <p>Chargement...</p>
            ) : error ? (
              <p style={{ color: "crimson" }}>{error}</p>
            ) : filtered.length === 0 ? (
              <p>Aucune infrastructure trouvée.</p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 10,
                }}
              >
                {pageItems.map((it) => (
                  <li
                    key={it.id}
                    style={{
                      border: "1px solid #eef2ff",
                      borderRadius: 8,
                      padding: 12,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ width: 10 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background:
                            it.status === "Ouvert"
                              ? "#10b981"
                              : it.status === "Fermé"
                              ? "#f59e0b"
                              : "#64748b",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <strong
                            style={{
                              display: "block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {it.name}
                          </strong>
                          <div style={{ fontSize: 13, color: "#475569" }}>
                            {it.type} • {it.address}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ marginBottom: 6 }}>
                            <Badge
                              variant={
                                it.status === "Ouvert"
                                  ? "success"
                                  : it.status === "Fermé"
                                  ? "warn"
                                  : "neutral"
                              }
                            >
                              {it.status}
                            </Badge>
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            {formatDate(it.createdAt)}
                          </div>
                        </div>
                      </div>
                      {it.description ? (
                        <p style={{ margin: "8px 0 0", color: "#334155" }}>
                          {it.description}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {filtered.length > perPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <div style={{ color: "#64748b" }}>
                  {filtered.length} résultat(s)
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ padding: "6px 10px", borderRadius: 6 }}
                  >
                    Préc
                  </button>
                  <div
                    style={{
                      padding: "6px 10px",
                      background: "#f8fafc",
                      borderRadius: 6,
                    }}
                  >
                    {page} / {totalPages}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ padding: "6px 10px", borderRadius: 6 }}
                  >
                    Suiv
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: Summary + Map (placeholder) */}
        <aside style={{ minWidth: 0 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <h4 style={{ margin: "0 0 8px" }}>Résumé</h4>
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#0f172a",
                }}
              >
                <span>Total infrastructures</span>
                <strong>{items.length}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#0f172a",
                }}
              >
                <span>Fermé</span>
                <strong>
                  {items.filter((i) => i.status === "Fermé").length}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#0f172a",
                }}
              >
                <span>Infrastructure pleine</span>
                <strong>
                  {items.filter((i) => i.status === "Plein").length}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 10, padding: 12 }}>
            <h4 style={{ margin: "0 0 8px" }}>Carte</h4>
            <div
              aria-hidden
              style={{
                height: 300,
                background: "linear-gradient(180deg,#e6eefc,#f8fafc)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Placeholder carte — intégrez Leaflet/Mapbox/Google Maps ici pour
              voir les infrastructures géolocalisées
            </div>
          </div>
        </aside>
      </main>

      {/* Modal Form */}
      {showForm && (
        <div
          role="dialog"
          aria-modal
          aria-label="Ajouter une infrastructure"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(2,6,23,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 1000,
          }}
        >
          <FormCreate
            onCancel={() => setShowForm(false)}
            onSubmit={handleCreate}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}

/* Form component */
function FormCreate({
  onCancel,
  onSubmit,
  submitting,
}: {
  onCancel: () => void;
  onSubmit: (
    payload: Omit<Infrastructure, "id" | "createdAt">
  ) => Promise<void>;
  submitting: boolean;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<InfrastructureType>("Autre");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Infrastructure["status"]>("Plein");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Le nom est requis";
    if (!type) e.type = "Le type est requis";
    if (lat && Number.isNaN(Number(lat))) e.lat = "Latitude invalide";
    if (lng && Number.isNaN(Number(lng))) e.lng = "Longitude invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      type,
      address: address.trim() || undefined,
      status,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
      description: desc.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: 720,
        maxWidth: "100%",
        background: "white",
        borderRadius: 10,
        padding: 18,
        boxShadow: "0 8px 20px rgba(2,6,23,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Ajouter une infrastructure</h3>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Nom *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
          {errors.name && (
            <div style={{ color: "crimson", fontSize: 13 }}>{errors.name}</div>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as InfrastructureType)}
            style={{ width: "100%", padding: 8, borderRadius: 8 }}
          >
            <option value="Route">Route</option>
            <option value="Eau">Eau</option>
            <option value="Eclairage">Eclairage</option>
            <option value="Batiment">Bâtiment</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.type && (
            <div style={{ color: "crimson", fontSize: 13 }}>{errors.type}</div>
          )}
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Adresse
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Statut
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Infrastructure["status"])
            }
            style={{ width: "100%", padding: 8, borderRadius: 8 }}
          >
            <option value="Ouvert">Ouvert</option>
            <option value="Fermé">Fermé</option>
            <option value="Plein">Plein</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Latitude
          </label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="49.182..."
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
          {errors.lat && (
            <div style={{ color: "crimson", fontSize: 13 }}>{errors.lat}</div>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Longitude
          </label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="-0.370..."
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
          {errors.lng && (
            <div style={{ color: "crimson", fontSize: 13 }}>{errors.lng}</div>
          )}
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            Description
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 14,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#f1f5f9",
            border: "none",
          }}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#0ea5a4",
            color: "white",
            border: "none",
            fontWeight: 700,
          }}
        >
          {submitting ? "Enregistrement..." : "Créer"}
        </button>
      </div>
    </form>
  );
}
