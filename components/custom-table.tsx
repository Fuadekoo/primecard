"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Calendar,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Navigation,
} from "lucide-react";
import Image from "next/image";

export interface ColumnDef<T> {
  key: string;
  label: string;
  renderCell?: (item: T) => React.ReactNode;
}

interface CustomTableProps {
  rows: Array<
    Record<string, string> & { key?: string | number; id?: string | number }
  >;
  columns: Array<ColumnDef<Record<string, string>>>;
  totalRows: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchValue: string;
  onSearch: (value: string) => void;
  isLoading?: boolean;
  enableDateFilter?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  onDateChange?: (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

const PAGE_SIZES = [1, 5, 50, 100];

type LatLng = { lat: number; lng: number };

function parseLocation(loc: string): (LatLng & { accuracy?: number }) | null {
  if (!loc || loc.toLowerCase() === "unknown") return null;
  const parts = loc.split(",").map((s) => s.trim());
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  const accuracy = parts[2] ? Number(parts[2]) : undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, accuracy };
}

function CustomTable({
  rows,
  columns,
  totalRows,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearch,
  isLoading = false,
  enableDateFilter = false,
  startDate,
  endDate,
  onDateChange,
}: CustomTableProps) {
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");

  const [localSearch, setLocalSearch] = useState(searchValue);

  // Reverse geocoded names cache
  const [placeNames, setPlaceNames] = useState<Record<string, string>>({});

  const handleApplyDateFilter = () => {
    if (onDateChange) {
      onDateChange({ startDate: localStartDate, endDate: localEndDate });
    }
    setShowDateFilter(false);
  };

  const handleClearDateFilter = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    if (onDateChange) {
      onDateChange({ startDate: null, endDate: null });
    }
    setShowDateFilter(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setZoomedImageUrl(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };

  // Unique coords from current rows for reverse geocoding
  const coordKeys = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const raw = String(r.location || "");
      const p = parseLocation(raw);
      if (p) set.add(`${p.lat},${p.lng}`);
    }
    return Array.from(set);
  }, [rows]);

  // Reverse geocode via server API (node-geocoder)
  useEffect(() => {
    const toFetch = coordKeys.filter((k) => !placeNames[k]);
    if (toFetch.length === 0) return;

    const controller = new AbortController();

    const fetchOne = async (key: string) => {
      const [lat, lng] = key.split(",").map(Number);
      try {
        const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const name = data?.name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setPlaceNames((prev) => ({ ...prev, [key]: name }));
      } catch {
        setPlaceNames((prev) => ({
          ...prev,
          [key]: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }));
      }
    };

    (async () => {
      // Simple batch; could throttle if needed
      await Promise.all(toFetch.slice(0, 24).map(fetchOne));
    })();

    return () => controller.abort();
  }, [coordKeys, placeNames]);

  // Open Google Maps to the place
  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${lat},${lng}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Open Google Maps driving directions from user's location to the guest
  const openDirections = (lat: number, lng: number) => {
    const open = (origin?: string) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${lat},${lng}`
      )}${
        origin ? `&origin=${encodeURIComponent(origin)}` : ""
      }&travelmode=driving`;
      window.open(url, "_blank", "noopener,noreferrer");
    };

    if ("geolocation" in navigator) {
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        open("My Location");
      }, 4000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          open(`${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          open("My Location");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    } else {
      open("My Location");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      {/* Search and page size */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <form
          className="flex items-center gap-2 w-full sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(localSearch);
          }}
        >
          {enableDateFilter && (
            <button
              type="button"
              onClick={() => setShowDateFilter(true)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 ml-2"
              aria-label="Filter by date"
              disabled={isLoading}
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </form>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            disabled={isLoading}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Filter Modal */}
      {showDateFilter && enableDateFilter && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filter by Date</h2>
              <button
                onClick={() => setShowDateFilter(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start justify-center gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
                  Start Date
                </h3>
                <Calendar
                  aria-label="Start Date"
                  value={localStartDate ? parseDate(localStartDate) : null}
                  onChange={(date) =>
                    setLocalStartDate(date ? date.toString() : "")
                  }
                  isDisabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
                  End Date
                </h3>
                <Calendar
                  aria-label="End Date"
                  value={localEndDate ? parseDate(localEndDate) : null}
                  onChange={(date) =>
                    setLocalEndDate(date ? date.toString() : "")
                  }
                  isDisabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDateFilter(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleClearDateFilter}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                onClick={handleApplyDateFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <Table aria-label="Data table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.key === "location" ? "Name" : column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            emptyContent={
              !isLoading && rows.length === 0 ? "No data to display." : " "
            }
          >
            {(item) => (
              <TableRow
                key={item.key || item.id}
                className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                {(columnKey) => {
                  const column = columns.find((col) => col.key === columnKey);

                  // Location column: resolved name + buttons
                  if (columnKey === "location") {
                    const raw = String(item.location || "");
                    const parsed = parseLocation(raw);
                    const key = parsed ? `${parsed.lat},${parsed.lng}` : "";
                    const name = parsed
                      ? placeNames[key] || "Resolving..."
                      : "-";

                    return (
                      <TableCell className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[240px]" title={name}>
                            {name}
                          </span>
                          {parsed && (
                            <>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-xs hover:bg-gray-100"
                                onClick={() =>
                                  openGoogleMaps(parsed.lat, parsed.lng)
                                }
                                title="Open in Google Maps"
                              >
                                <MapPin size={14} />
                                View on map
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-xs hover:bg-gray-100"
                                onClick={() =>
                                  openDirections(parsed.lat, parsed.lng)
                                }
                                title="Driving directions from my location"
                              >
                                <Navigation size={14} />
                                distance from me
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {column && column.renderCell ? (
                        column.renderCell(item)
                      ) : columnKey === "photo" &&
                        typeof item.photo === "string" &&
                        item.photo ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={`/api/filedata/${item.photo}`}
                            alt={`Photo for ${item.id || item.key}`}
                            fill
                            className="object-cover rounded-md cursor-pointer"
                            onClick={() =>
                              handleImageClick(
                                `/api/filedata/${(item).photo}`
                              )
                            }
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (
                                parent &&
                                !parent.querySelector(".no-preview-text")
                              ) {
                                const errorText =
                                  document.createElement("span");
                                errorText.textContent = "No preview";
                                errorText.className =
                                  "text-xs text-gray-400 no-preview-text flex items-center justify-center h-full";
                                parent.appendChild(errorText);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center p-6">
          <span className="text-gray-500">Loading data...</span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-gray-700">
        <div>
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {rows.length > 0
              ? Math.min((page - 1) * pageSize + 1, totalRows)
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(page * pageSize, totalRows)}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{totalRows}</span>{" "}
          results
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pg) => {
                if (totalPages <= 5) return true;
                if (page <= 3) return pg <= 4 || pg === totalPages;
                if (page >= totalPages - 2)
                  return pg >= totalPages - 3 || pg === 1;
                return (
                  Math.abs(pg - page) <= 1 || pg === 1 || pg === totalPages
                );
              })
              .map((pg, i, arr) => (
                <React.Fragment key={pg}>
                  {i > 0 && pg - arr[i - 1] > 1 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(pg)}
                    disabled={pg === page || isLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      pg === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                    } disabled:opacity-50`}
                  >
                    {pg}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isLoading}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImageUrl && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseZoom}
        >
          <div
            className="relative bg-white p-2 rounded-lg shadow-xl max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomedImageUrl}
              alt="Zoomed content"
              className="block max-w-[90vw] max-h-[90vh] object-contain rounded"
              width={1200}
              height={800}
            />
            <button
              onClick={handleCloseZoom}
              className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/75 focus:outline-none"
              aria-label="Close zoomed image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTable;
