import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
}

export function Table<T>({ columns, rows, rowKey, empty = '데이터가 없습니다' }: TableProps<T>) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
              {empty}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
