import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
      light: '#66ffaa',
      dark: '#00cc66',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff6b35',
      light: '#ff8a65',
      dark: '#cc5522',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    error: {
      main: '#ff4444',
    },
    warning: {
      main: '#ffaa00',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#00ff88',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #00ff88, #00cc66)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#cccccc',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#aaaaaa',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00ff88, #00cc66)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(135deg, #00cc66, #00aa55)',
          },
        },
        outlined: {
          borderColor: '#00ff88',
          color: '#00ff88',
          '&:hover': {
            borderColor: '#00cc66',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #333',
          borderRadius: 12,
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#00ff88',
            boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            '&:hover fieldset': {
              borderColor: '#00ff88',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff88',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#aaaaaa',
            '&.Mui-focused': {
              color: '#00ff88',
            },
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderColor: '#333',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff88',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff88',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a2a',
          color: '#cccccc',
          border: '1px solid #333',
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            borderColor: '#00ff88',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            color: '#ff6b35',
            borderColor: '#ff6b35',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a2a',
          borderRadius: 4,
        },
        bar: {
          background: 'linear-gradient(90deg, #00ff88, #00cc66)',
          borderRadius: 4,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#00ff88',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#aaaaaa',
          '&.Mui-selected': {
            color: '#00ff88',
          },
          '&:hover': {
            color: '#00ff88',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #333',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 255, 136, 0.2)',
          },
        },
      },
    },
  },
})