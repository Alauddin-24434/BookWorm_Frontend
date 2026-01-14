'use client';

import React from 'react';
import Image from 'next/image';
import { DatabaseIcon } from 'lucide-react';

export interface TableColumn {
  key: string; // field in row data
  label: string; // column header
  render?: (row: any) => React.ReactNode; // optional custom render function
  className?: string;
}

interface ResponsiveTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
  loading?: boolean;
}

export function ResponsiveTable({ columns, data, actions, loading }: ResponsiveTableProps) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
      </div>
    );
  }


if (!data.length) {
  return (
    <div className="border rounded-lg text-center py-8 text-gray-500 flex flex-col items-center gap-2">
      <DatabaseIcon className="w-12 h-12 text-gray-400" />
      <p>No data available.</p>
    </div>
  );
}


  return (
   <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 border">
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
          
            className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase ${
              col.className || ''
            }`}
          >
            {col.label}
          </th>
        ))}
        {actions && (
          /* Text alignment change: text-center */
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        )}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row, idx) => (
        <tr key={row._id || idx} className="hover:bg-gray-50">
          {columns.map((col) => (
            /* Text alignment change: text-center */
            <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
              {col.render ? col.render(row) : row[col.key]}
            </td>
          ))}
          {actions && (
            /* Text alignment change: text-center and flex justification */
            <td className="px-6 py-4 whitespace-nowrap text-center">
              <div className="flex justify-center">
                {actions(row)}
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
