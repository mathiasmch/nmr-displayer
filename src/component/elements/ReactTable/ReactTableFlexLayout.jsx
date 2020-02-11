/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useTable, useSortBy, useFlexLayout } from 'react-table';

import { ReactTableStyle } from './Style';

const ReactTableFlexLayout = ({ data, columns }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useFlexLayout,
  );
  return (
    <table {...getTableProps()} css={ReactTableStyle}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            key={headerGroup.getHeaderGroupProps().key}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <th
                key={column.getHeaderProps().key}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        style={{ display: 'block', height: '100%', overflowY: 'auto' }}
      >
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr key={row.getRowProps().key} {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    key={cell.getCellProps().key}
                    {...cell.getCellProps()}
                    style={{ ...cell.getCellProps().style, padding: '0px' }}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReactTableFlexLayout;