import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  PlayArrow,
  Stop,
  Settings,
  Security,
  Language,
  Database,
  Folder,
  Search,
} from '@mui/icons-material'

import { useToolConfig, useExecuteScan } from '../hooks/useApi'
import ScanResults from '../components/Scans/ScanResults'
import ToolConfig from '../components/Tools/ToolConfig'

const ToolsPage = () => {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const [selectedTool, setSelectedTool] = useState(toolId || 'nmap')
  const [scanConfig, setScanConfig] = useState({})
  const [currentScan, setCurrentScan] = useState(null)

  const { data: toolConfig, isLoading: configLoading } = useToolConfig(selectedTool)
  const { mutate: executeScan, isLoading: scanLoading } = useExecuteScan()

  const tools = [
    {
      id: 'nmap',
      name: 'Nmap',
      description: 'Network scanning and port discovery',
      icon: <Search />,
      color: '#00ff88',
    },
    {
      id: 'nikto',
      name: 'Nikto',
      description: 'Web server vulnerability scanning',
      icon: <Language />,
      color: '#ff6b35',
    },
    {
      id: 'sqlmap',
      name: 'SQLMap',
      description: 'SQL injection testing',
      icon: <Database />,
      color: '#2196f3',
    },
    {
      id: 'wpscan',
      name: 'WPScan',
      description: 'WordPress security scanning',
      icon: <Language />,
      color: '#9c27b0',
    },
    {
      id: 'dirb',
      name: 'DIRB',
      description: 'Directory and file brute-forcing',
      icon: <Folder />,
      color: '#ff9800',
    },
    {
      id: 'searchsploit',
      name: 'SearchSploit',
      description: 'Exploit database searching',
      icon: <Security />,
      color: '#f44336',
    },
  ]

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId)
    navigate(`/tools/${toolId}`)
    setScanConfig({})
    setCurrentScan(null)
  }

  const handleConfigChange = (field, value) => {
    setScanConfig(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExecuteScan = () => {
    if (!scanConfig.target) {
      return
    }

    executeScan(
      { tool: selectedTool, config: scanConfig },
      {
        onSuccess: (data) => {
          setCurrentScan(data)
        },
        onError: (error) => {
          console.error('Scan failed:', error)
        },
      }
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  const selectedToolData = tools.find(tool => tool.id === selectedTool)

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Security Tools
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and execute security scanning tools
          </Typography>
        </Box>

        {/* Tool Selection */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <motion.div variants={itemVariants}>
                <Card
                  className={`tool-card ${selectedTool === tool.id ? 'active' : ''}`}
                  onClick={() => handleToolSelect(tool.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          backgroundColor: `${tool.color}20`,
                          color: tool.color,
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        {tool.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="div">
                          {tool.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tool.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Tool Configuration and Results */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="tool-card">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        backgroundColor: `${selectedToolData?.color}20`,
                        color: selectedToolData?.color,
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      {selectedToolData?.icon}
                    </Box>
                    <Typography variant="h5">
                      {selectedToolData?.name} Configuration
                    </Typography>
                  </Box>

                  {configLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ToolConfig
                      tool={selectedTool}
                      config={scanConfig}
                      onConfigChange={handleConfigChange}
                      toolConfig={toolConfig}
                    />
                  )}

                  <Box mt={3} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={handleExecuteScan}
                      disabled={!scanConfig.target || scanLoading}
                      fullWidth
                    >
                      {scanLoading ? 'Executing...' : 'Execute Scan'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Settings />}
                      onClick={() => {/* Open advanced settings */}}
                    >
                      Advanced
                    </Button>
                  </Box>

                  {scanLoading && (
                    <Box mt={2}>
                      <Alert severity="info" icon={<CircularProgress size={20} />}>
                        Scan in progress... This may take several minutes.
                      </Alert>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Card className="tool-card">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Scan Results
                  </Typography>

                  {currentScan ? (
                    <ScanResults scan={currentScan} />
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      py={8}
                      color="text.secondary"
                    >
                      <Search sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        No Scan Results
                      </Typography>
                      <Typography variant="body2" align="center">
                        Configure the tool parameters and execute a scan to see results here.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}

export default ToolsPage