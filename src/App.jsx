import React, { useState } from 'react';
import CsvViewer from './CsvViewer';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [groupBy, setGroupBy] = useState(null);
  const [showHeaders, setShowHeaders] = useState(true);

  return (
    <div className="app">
      <Sidebar
        columns={columns}
        onGroupBy={setGroupBy}
        showHeaders={showHeaders}
        onToggleHeaders={setShowHeaders}
      />
      <CsvViewer
        groupBy={groupBy}
        onColumnsDetected={setColumns}
        showHeaders={showHeaders}
      />
    </div>
  );
};
export default App;
