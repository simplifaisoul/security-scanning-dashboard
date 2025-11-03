import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Schedule,
  Assessment,
} from '@mui/icons-material'
import { format } from 'date-fns'
import ReactJson from 'react-json-view'

const ScanResults = ({ scan }) => {
  if (!scan) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        color="text.secondary"
      >
        <Assessment sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          No Scan Results
        </Typography>
        <Typography variant="body2" align="center">
          Execute a scan to see results here.
        </Typography>
      </Box>
    )
  }

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

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'error'
      case 'Medium':
        return 'warning'
      case 'Low':
        return 'success'
      default:
        return 'default'
    }
  }

  const formatDuration = (startedAt, completedAt) => {
    if (!startedAt || !completedAt) return 'N/A'
    
    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const duration = Math.round((end - start) / 1000) // Convert to seconds
    
    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.round(duration / 60)}m ${duration % 60}s`
    return `${Math.round(duration / 3600)}h ${Math.round((duration % 3600) / 60)}m`
  }

  return (
    <Box>
      {/* Scan Header */}
      <Card className="tool-card" sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {scan.tool?.toUpperCase()} Scan Results
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {getStatusIcon(scan.status)}
                <Chip
                  label={scan.status?.toUpperCase() || 'UNKNOWN'}
                  color={getStatusColor(scan.status)}
                  size="small"
                />
                {scan.riskLevel && (
                  <Chip
                    label={`Risk: ${scan.riskLevel}`}
                    color={getRiskLevelColor(scan.riskLevel)}
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Target: {scan.target || 'Unknown'}
              </Typography>
            </Box>
          </Box>

          {/* Scan Metadata */}
          <Box display="flex" gap={3} flexWrap="wrap" mb={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Started
              </Typography>
              <Typography variant="body2">
                {scan.startedAt ? format(new Date(scan.startedAt), 'PPP p') : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Completed
              </Typography>
              <Typography variant="body2">
                {scan.completedAt ? format(new Date(scan.completedAt), 'PPP p') : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2">
                {formatDuration(scan.startedAt, scan.completedAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Findings
              </Typography>
              <Typography variant="body2">
                {scan.findings || 0}
              </Typography>
            </Box>
          </Box>

          {/* Progress for running scans */}
          {scan.status === 'running' && (
            <Box>
              <LinearProgress
                variant="indeterminate"
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Scan in progress...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {scan.status === 'failed' && scan.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Scan Failed
          </Typography>
          <Typography variant="body2">
            {scan.error}
          </Typography>
        </Alert>
      )}

      {/* Scan Output */}
      {scan.output && (
        <Card className="tool-card" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scan Output
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Raw Output</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  className="terminal-output"
                  sx={{
                    maxHeight: 400,
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: '#000000',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#00ff88' }}>
                    {scan.output}
                  </pre>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Structured Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <ReactJson
                    src={{
                      tool: scan.tool,
                      target: scan.target,
                      status: scan.status,
                      findings: scan.findings,
                      riskLevel: scan.riskLevel,
                      duration: formatDuration(scan.startedAt, scan.completedAt),
                      output: scan.output ? scan.output.substring(0, 500) + '...' : '',
                    }}
                    theme="rjv-default"
                    collapsed={2}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      {scan.config && (
        <Card className="tool-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scan Configuration
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <ReactJson
                src={scan.config}
                theme="rjv-default"
                collapsed={1}
                displayObjectSize={false}
                displayDataTypes={false}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ScanResults