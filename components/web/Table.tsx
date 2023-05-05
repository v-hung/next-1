"use client"
import React, { useState } from 'react';

type TableType = {
  className?: string
  data: any[],
  titles: {[key: string]: string}
}

const Table: React.FC<TableType> = ({className = "", data, titles}) => {

  return (
    <div className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {Object.entries(titles).map((v,i) =>
              <th scope="col" className="px-6 py-3" key={i}>
                {v[1]}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length == 0 ? <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td colSpan={Object.entries(titles).length} className="px-6 py-4 text-center">Không có bản ghi nào</td>
          </tr> : null }
          {data.map((v,i) =>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900" key={i}>
              {Object.entries(titles).map((v2,i2) =>
                <td className="px-6 py-4" key={`${i}${i2}`}>{v[v2[0]]}</td>
              )}
            </tr> 
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
