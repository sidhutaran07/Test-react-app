import React from 'react';

function DataTable({ title, items, columns }) {
  // If there's no data, show a message instead of an empty table
  if (!items || items.length === 0) {
    return (
      <div>
        <h3>{title}</h3>
        <p>No data found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>{title}</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* Table Headers */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {/* Handle arrays like 'socialMedia' by joining them */}
                  {Array.isArray(item[col.accessor])
                    ? item[col.accessor].join(', ')
                    : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

