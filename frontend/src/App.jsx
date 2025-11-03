import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import ToolsPage from './pages/ToolsPage'
import ScanResults from './pages/ScanResults'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:toolId" element={<ToolsPage />} />
          <Route path="/results" element={<ScanResults />} />
          <Route path="/results/:scanId" element={<ScanResults />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App