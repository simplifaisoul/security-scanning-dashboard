import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Download,
  Share,
  Delete,
  Visibility,
  Schedule,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material'
import { format } from 'date-fns'

import { useScanHistory } from '../hooks/useApi'

const ScanResults = ({ scanId }) => {
  const { data: scans, isLoading } = useScanHistory()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />
      case 'failed':
        return <Error color="error" />
      case 'running':
        return <Schedule color="warning" />
      default:
        return <Warning color="info" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      case 'running':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handleExportResults = (scan) => {
    // Export functionality
    console.log('Exporting scan:', scan.id)
  }

  const handleShareResults = (scan) => {
    // Share functionality
    console.log('Sharing scan:', scan.id)
  }

  const handleDeleteScan = (scan) => {
    // Delete functionality
    console.log('Deleting scan:', scan.id)
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading scan results...</Typography>
      </Box>
    )
  }

  const displayScans = scanId 
    ? scans?.filter(scan => scan.id === scanId) 
    : scans

  if (!displayScans || displayScans.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        color="text.secondary"
      >
        <Visibility sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          No Scan Results Found
        </Typography>
        <Typography variant="body2" align="center">
          {scanId ? 'Scan not found or may have been deleted.' : 'Execute a scan to see results here.'}
        </Typography>
      </Box>
    )
  }

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
            Scan Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your security scan results
          </Typography>
        </Box>

        {/* Results List */}
        <Box>
          {displayScans.map((scan) => (
            <motion.div key={scan.id} variants={itemVariants}>
              <Card className="tool-card" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {scan.tool.toUpperCase()} Scan
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getStatusIcon(scan.status)}
                        <Chip
                          label={scan.status.toUpperCase()}
                          color={getStatusColor(scan.status)}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Target: {scan.target}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(scan.createdAt), 'PPP p')}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <Tooltip title="Export Results">
                        <IconButton
                          size="small"
                          onClick={() => handleExportResults(scan)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share Results">
                        <IconButton
                          size="small"
                          onClick={() => handleShareResults(scan)}
                        >
                          <Share />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Scan">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteScan(scan)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Scan Summary */}
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Summary
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Chip
                        label={`Duration: ${scan.duration || 'N/A'}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Findings: ${scan.findings || 0}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`Risk Level: ${scan.riskLevel || 'Unknown'}`}
                        variant="outlined"
                        size="small"
                        color={
                          scan.riskLevel === 'High' ? 'error' :
                          scan.riskLevel === 'Medium' ? 'warning' :
                          scan.riskLevel === 'Low' ? 'success' : 'default'
                        }
                      />
                    </Box>
                  </Box>

                  {/* Scan Output */}
                  {scan.output && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Output
                      </Typography>
                      <Box
                        className="terminal-output"
                        sx={{
                          maxHeight: 300,
                          overflow: 'auto',
                          fontSize: '0.875rem',
                          p: 2,
                          borderRadius: 1,
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {scan.output}
                        </pre>
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box mt={2} display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {/* View detailed results */}}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleExportResults(scan)}
                    >
                      Export PDF
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleExportResults(scan)}
                    >
                      Export JSON
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  )
}

export default ScanResults