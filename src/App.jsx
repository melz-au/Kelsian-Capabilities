import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CsvViewer from './CsvViewer';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary component


// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />  {/* This ensures baseline styles are applied */}
        <CsvViewer />
      </ThemeProvider>
    </ErrorBoundary>

  );
};

export default App;



