import React, { useState } from 'react';
import Papa from 'papaparse';
import Sidebar from './Sidebar';
import './CsvViewer.css';

const getColorFromValue = (value) => {
  const hash = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 85%)`;
};

const CsvViewer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [colorBy, setColorBy] = useState(null);
  const [groupBy, setGroupBy] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        const headers = Object.keys(parsedData[0] || {});
        setColumns(headers);
        setSelectedColumns(headers);
        setData(parsedData);
        setColorBy(null);
        setGroupBy(null);
      },
    });
  };

  const handleToggleColumn = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  const groupedData = groupBy
    ? data.reduce((acc, row) => {
        const key = row[groupBy] || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {})
    : { All: data };

  return (
    <div className="csv-viewer">
      <Sidebar
        columns={columns}
        selectedColumns={selectedColumns}
        onToggleColumn={handleToggleColumn}
        colorBy={colorBy}
        onColorByChange={setColorBy}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />
      <div className="content">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <div className="grouped-columns-container">
          {Object.entries(groupedData).map(([group, rows]) => (
            <div key={group} className="group-column">
              <div className="group-header">{group}</div>
              {rows.map((row, idx) => {
                const bgColor = colorBy ? getColorFromValue(row[colorBy] || '') : '#fafafa';
                return (
                  <div
                    key={idx}
                    className="csv-card"
                    style={{ backgroundColor: bgColor }}
                  >
                    {selectedColumns.map((col) => (
                      <div key={col} className="csv-card-row">
                        <span className="csv-card-label">{col}:</span>
                        <span className="csv-card-value">{row[col]}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CsvViewer;
