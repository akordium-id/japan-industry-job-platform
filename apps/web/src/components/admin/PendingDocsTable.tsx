import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import styles from "./PendingDocsTable.module.css";

import { documentApi, type VaultDoc } from "@/api/documents";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PendingDoc = VaultDoc & { user_name: string; user_email: string };

interface Props {
  data: PendingDoc[];
  onDecide: (id: number, action: "approved" | "rejected") => void;
  isDeciding?: boolean;
}

export const PendingDocsTable: React.FC<Props> = ({
  data,
  onDecide,
  isDeciding,
}) => {
  const columns = useMemo<ColumnDef<PendingDoc>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "User",
        cell: (info) => (
          <div>
            <div className={styles["userName"]}>{String(info.getValue())}</div>
            <div className={styles["userEmail"]}>
              {info.row.original.user_email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Document",
        cell: (info) => (
          <div>
            <div className={styles["docTitle"]}>{String(info.getValue())}</div>
            <div className={styles["docType"]}>
              {info.row.original.type.toUpperCase()}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "verification_status",
        header: "Status",
        cell: (info) => (
          <Badge variant="warning">{String(info.getValue())}</Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const doc = info.row.original;
          return (
            <div className={styles["actions"]}>
              <a
                href={documentApi.fileUrl(doc.id)}
                target="_blank"
                rel="noreferrer"
                className={styles["viewLink"]}
              >
                <Button variant="secondary" size="sm">
                  View file
                </Button>
              </a>
              <Button
                variant="primary"
                size="sm"
                disabled={isDeciding}
                onClick={() => onDecide(doc.id, "approved")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeciding}
                onClick={() => onDecide(doc.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [onDecide, isDeciding],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = data.length;
  const pageCount = table.getPageCount();
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className={styles["tableWrapper"]}>
      <table className={styles["table"]}>
        <thead className={styles["thead"]}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles["th"]}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles["tr"]}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles["td"]}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles["paginationBar"]}>
        <div className={styles["paginationInfo"]}>
          <span>
            Showing <strong>{startRow}</strong>–<strong>{endRow}</strong> of{" "}
            <strong>{totalRows}</strong> documents
          </span>
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>Page size:</span>
            <select
              className={styles["pageSizeSelect"]}
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles["paginationControls"]}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹ Prev
          </Button>
          <span className={styles["pageIndicator"]}>
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{Math.max(1, pageCount)}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next ›
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
};
