"use client";
import React, { useMemo, useState } from "react";
import useAction from "@/hooks/useActions";
import CustomTable from "@/components/custom-table";
import { Button } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";
import { addToast } from "@heroui/react";
import { getGuest } from "@/actions/admin/dashboard";

type Guest = {
  id: string;
  guestId: string;
  location: string;
  totalScan: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ColumnDef = {
  key: string;
  label: string;
  renderCell?: (item: Record<string, string>, idx?: number) => React.ReactNode;
};

function AllData() {
  // Filters & pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Details modal
  const [selected, setSelected] = useState<Guest | null>(null);

  // Data fetch
  const [data, refresh, loading] = useAction(
    getGuest,
    [true, () => {}],
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined,
    page,
    pageSize
  );

  const guests: Guest[] = data?.data || [];
  const pagination = data?.pagination;

  // Client-side search (by guestId or location)
  const filteredRows = useMemo(() => {
    if (!search.trim()) return guests;
    const q = search.toLowerCase();
    return guests.filter(
      (g) =>
        g.guestId.toLowerCase().includes(q) ||
        (g.location || "").toLowerCase().includes(q)
    );
  }, [guests, search]);

  // Table rows
  const rows =
    filteredRows.map((guest) => ({
      id: String(guest.id),
      guestId: guest.guestId,
      location: guest.location || "-",
      totalScan: String(guest.totalScan ?? 0),
      createdAt: new Date(guest.createdAt).toLocaleString(),
      updatedAt: new Date(guest.updatedAt).toLocaleString(),
    })) || [];

  const handleCopy = async (value: string, label = "Guest ID") => {
    try {
      await navigator.clipboard.writeText(value);
      addToast({
        title: "Copied",
        description: `${label} copied to clipboard.`,
      });
    } catch {
      addToast({ title: "Error", description: "Failed to copy." });
    }
  };

  const handleExportCSV = () => {
    const header = [
      "ID",
      "Guest ID",
      "Location",
      "Total Scan",
      "Created At",
      "Updated At",
    ];
    const body = rows.map((r) => [
      r.id,
      r.guestId,
      r.location,
      r.totalScan,
      r.createdAt,
      r.updatedAt,
    ]);
    const csv = [header, ...body]
      .map((line) =>
        line
          .map((cell) => {
            const s = String(cell ?? "");
            return s.includes(",") || s.includes('"')
              ? `"${s.replace(/"/g, '""')}"`
              : s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = `guests_${new Date().toISOString().slice(0, 10)}.csv`;
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: ColumnDef[] = [
    {
      key: "autoId",
      label: "#",
      renderCell: (item) => {
        const idx = rows.findIndex((r) => r.id === item.id);
        return idx !== -1 ? (page - 1) * pageSize + idx + 1 : item.id;
      },
    },
    {
      key: "guestId",
      label: "Guest ID",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[180px]" title={item.guestId}>
            {item.guestId}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(item.guestId, "Guest ID")}
            className="p-1 rounded hover:bg-black/5"
            title="Copy Guest ID"
          >
            <Copy size={14} />
          </button>
        </div>
      ),
    },
    { key: "location", label: "Location Name" },
    {
      key: "totalScan",
      label: "Total Scan",
      renderCell: (item) => (
        <span className="px-2 py-0.5 rounded-full bg-black text-white text-xs font-semibold">
          {item.totalScan}
        </span>
      ),
    },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    {
      key: "actions",
      label: "Actions",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            onPress={() => {
              const g = guests.find((x) => String(x.id) === String(item.id));
              if (g) setSelected(g);
            }}
            startContent={<Eye size={16} />}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Guests</h1>
          <p className="text-sm text-black/60">
            Track unique visitors and total scans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            onPress={refresh}
            startContent={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button
            onPress={handleExportCSV}
            startContent={<Download size={16} />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <CustomTable
        columns={columns}
        rows={rows}
        totalRows={pagination?.totalRecords || rows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        isLoading={loading}
        enableDateFilter
        startDate={startDate}
        endDate={endDate}
      />

      {/* Footer pagination summary (optional) */}
      <div className="mt-3 flex items-center justify-between text-sm text-black/60">
        <span>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, pagination?.totalRecords || rows.length)}{" "}
          of {pagination?.totalRecords || rows.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            isDisabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            startContent={<ChevronLeft size={16} />}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="flat"
            isDisabled={rows.length < pageSize}
            onPress={() => setPage((p) => p + 1)}
            endContent={<ChevronRight size={16} />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Guest Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-black/60">ID</span>
                <span className="font-mono">{String(selected.id)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-black/60">Guest ID</span>
                <span className="font-mono break-all">{selected.guestId}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-black/60">Location</span>
                <span
                  className="truncate max-w-[220px]"
                  title={selected.location}
                >
                  {selected.location || "-"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-black/60">Total Scan</span>
                <span className="font-semibold">{selected.totalScan ?? 0}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-black/60">First Seen</span>
                <span>{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-black/60">Last Seen</span>
                <span>{new Date(selected.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="flat"
                onPress={() => handleCopy(selected.guestId, "Guest ID")}
                startContent={<Copy size={16} />}
              >
                Copy ID
              </Button>
              <Button color="primary" onPress={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllData;
