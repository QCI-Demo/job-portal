import React from 'react';
import './DataTable.css';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  emptyMessage = 'No data available',
  isLoading = false,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>): React.ReactNode => {
    if (column.render) return column.render(row);
    const value = row[column.key as keyof T];
    return value != null ? String(value) : '';
  };

  return (
    <div className={`dashboard-data-table ${className}`}>
      <table className="dashboard-data-table__table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="dashboard-data-table__header"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="dashboard-data-table__loading">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="dashboard-data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={String(row[keyField] ?? index)}
                className={onRowClick ? 'dashboard-data-table__row--clickable' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="dashboard-data-table__cell">
                    {getCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
