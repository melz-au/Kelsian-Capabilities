import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { TextField, Box, Chip, Typography, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material'; // Import MUI components
import Sidebar from './Sidebar';
import './CsvViewer.css';

// A palette of visually distinct colors
const distinctColors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
  '#f58231', '#911eb4', '#46f0f0', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff',
  '#9a6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080'
];

// Function to assign a unique color per value
const getColorFromValue = (() => {
  const assignedColors = {};
  let colorIndex = 0;

  return (value) => {
    if (!assignedColors[value]) {
      assignedColors[value] = distinctColors[colorIndex % distinctColors.length];
      colorIndex++;
    }
    return assignedColors[value];
  };
})();

const CsvViewer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [colorBy, setColorBy] = useState(null);
  const [groupBy, setGroupBy] = useState(null);
  const [filters, setFilters] = useState({});
  const [systemColorMap, setSystemColorMap] = useState({});

  // Handle file upload and parsing
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;

        // Filter out columns containing '.id' in the header
        const filteredColumns = Object.keys(parsedData[0] || {}).filter(col => !col.includes('.id'));

        setColumns(filteredColumns);
        setSelectedColumns(filteredColumns);

        // Filter out rows where any column contains '.id'
        const filteredData = parsedData.filter(row =>
          Object.values(row).every(value => !String(value).includes('.id'))
        );

        setData(filteredData);
        setColorBy(null);
        setGroupBy(null);

        // Create a color map based on system.name (one color per system)
        createSystemColorMap(filteredData);
      },
    });
  };

  // Generate the system color map for each unique system.name
  const createSystemColorMap = (filteredData) => {
    const newColorMap = {};
    filteredData.forEach((row) => {
      const systemName = row['system.name'];

      // If systemName doesn't already have a color, assign one
      if (systemName && !newColorMap[systemName]) {
        const color = getColorFromValue(systemName);
        newColorMap[systemName] = color;
      }
    });

    setSystemColorMap(newColorMap); // Update the color map state
  };

  // Handle the filter change (Dropdown selection)
  const handleFilterChange = (col, value) => {
    setFilters((prev) => ({
      ...prev,
      [col]: value
    }));
  };

  const filteredData = data.filter((row) =>
    Object.entries(filters).every(([col, val]) =>
      row[col]?.toLowerCase().includes(val.toLowerCase())
    )
  );

  const groupedData = groupBy
    ? filteredData.reduce((acc, row) => {
        const key = row[groupBy] || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {})
    : { All: filteredData };

  // Handle toggling of selected columns
  const handleToggleColumn = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  // Get unique values for each column to populate dropdown options
  const getUniqueColumnValues = (col) => {
    return Array.from(new Set(data.map((row) => row[col]?.toString()))).filter(Boolean);
  };

  return (
    <Box className="csv-viewer" sx={{ padding: 2 }}>
      <Sidebar
        columns={columns}
        selectedColumns={selectedColumns}
        onToggleColumn={handleToggleColumn}
        colorBy={colorBy}
        onColorByChange={setColorBy}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />

      <Box className="content">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ marginBottom: '20px' }}
        />

        {/* Filter Dropdowns */}
        <Box className="filter-row" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {columns.map((col) => {
            const uniqueValues = getUniqueColumnValues(col);

            return (
              <FormControl key={col} sx={{ width: 200 }} size="small">
                <InputLabel>Filter by {col}</InputLabel>
                <Select
                  value={filters[col] || ''}
                  onChange={(e) => handleFilterChange(col, e.target.value)}
                  label={`Filter by ${col}`}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {uniqueValues.map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>

        <Box className="grouped-columns-container" sx={{ marginTop: 3 }}>
          {Object.entries(groupedData).map(([group, rows]) => {
            const uniqueColorValues = Array.from(
              new Set(rows.map((row) => row[colorBy]).filter(Boolean))
            );

            return (
              <Box key={group} className="group-column" sx={{ marginBottom: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {group}
                </Typography>

                {/* Add color background to system.name */}
                {colorBy && (
                  <Box className="system-color-row" sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                    {uniqueColorValues.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        style={{
                          backgroundColor: systemColorMap[val] || '#ccc',
                          color: '#fff',
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                )}

                {/* Display the columns with system.name as colored background */}
                {rows.map((row, idx) => {
                  const systemName = row['system.name'];
                  const systemColor = systemColorMap[systemName] || '#ccc';

                  return (
                    <Box
                      key={idx}
                      className="csv-card"
                      sx={{
                        backgroundColor: '#fff',
                        padding: 2,
                        borderRadius: 1,
                        boxShadow: 2,
                        marginTop: 2,
                      }}
                    >
                      {/* System Name with colored background */}
                      <Box
                        sx={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: systemColor,
                          color: '#fff',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          marginBottom: 2,
                        }}
                      >
                        {systemName}
                      </Box>

                      {/* Render other columns */}
                      {selectedColumns.map((col) => (
                        <Box key={col} sx={{ marginBottom: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {col}:
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {row[col]}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default CsvViewer;
