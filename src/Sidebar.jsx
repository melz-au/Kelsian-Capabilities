import React from 'react';
import './CsvViewer.css';

const Sidebar = ({ 
  columns, 
  selectedColumns, 
  onToggleColumn, 
  colorBy, 
  onColorByChange, 
  groupBy, 
  onGroupByChange 
}) => {
  return (
    <div className="sidebar">
      <h3>Select Columns</h3>
      {columns.map((col) => (
        <label key={col} className="sidebar-checkbox">
          <input
            type="checkbox"
            checked={selectedColumns.includes(col)}
            onChange={() => onToggleColumn(col)}
          />
          {col}
        </label>
      ))}

      <hr />

      <h3>Color Cards By</h3>
      <select value={colorBy || ''} onChange={(e) => onColorByChange(e.target.value)}>
        <option value="">None</option>
        {columns.map((col) => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>

      <hr />

      <h3>Group By</h3>
      <select value={groupBy || ''} onChange={(e) => onGroupByChange(e.target.value)}>
        <option value="">None</option>
        {columns.map((col) => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>
    </div>
  );
};

export default Sidebar;
