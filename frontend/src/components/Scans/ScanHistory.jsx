import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
} from '@mui/material'
import {
  Visibility,
  Download,
  Share,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Security,
  Language,
  Database,
  Folder,
  Search,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

const ScanHistory = ({ scans = [], loading = false }) => {
  const getToolIcon = (tool) => {
    const icons = {
      nmap: <Search />,
      nikto: <Language />,
      sqlmap: <Database />,
      wpscan: <Language />,
      dirb: <Folder />,
      searchsploit: <Security />,
    }
    return icons[tool] || <Security />
  }

  const getToolColor = (tool) => {
    const colors = {
      nmap: '#00ff88',
      nikto: '#ff6b35',
      sqlmap: '#2196f3',
      wpscan: '#9c27b0',
      dirb: '#ff9800',
      searchsploit: '#f44336',
    }
    return colors[tool] || '#666'
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  if (loading) {
    return (
      <Box>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography color="text.secondary">Loading scan history...</Typography>
      </Box>
    )
  }

  if (!scans || scans.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={4}
        color="text.secondary"
      >
        <Search sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          No Scan History
        </Typography>
        <Typography variant="body2">
          Execute your first scan to see results here.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {scans.map((scan, index) => (
        <motion.div
          key={scan.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="tool-card"
            sx={{
              mb: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2} flex={1}>
                  {/* Tool Icon */}
                  <Avatar
                    sx={{
                      backgroundColor: `${getToolColor(scan.tool)}20`,
                      color: getToolColor(scan.tool),
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getToolIcon(scan.tool)}
                  </Avatar>

                  {/* Scan Info */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6" component="div">
                        {scan.tool?.toUpperCase() || 'UNKNOWN'}
                      </Typography>
                      <Chip
                        label={scan.status?.toUpperCase() || 'UNKNOWN'}
                        color={getStatusColor(scan.status)}
                        size="small"
                        icon={getStatusIcon(scan.status)}
                      />
                      {scan.riskLevel && (
                        <Chip
                          label={scan.riskLevel}
                          color={
                            scan.riskLevel === 'High' ? 'error' :
                            scan.riskLevel === 'Medium' ? 'warning' : 'success'
                          }
                          size="small"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Target: {scan.target || 'Unknown'}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="caption" color="text.secondary">
                        {scan.createdAt && format(new Date(scan.createdAt), 'MMM dd, HH:mm')}
                      </Typography>
                      {scan.findings !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                          {scan.findings} findings
                        </Typography>
                      )}
                      {scan.duration && (
                        <Typography variant="caption" color="text.secondary">
                          {scan.duration}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Actions */}
                <Box display="flex" gap={1}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => {/* Handle view */}}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export Results">
                    <IconButton size="small" onClick={() => {/* Handle export */}}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small" onClick={() => {/* Handle share */}}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Progress for running scans */}
              {scan.status === 'running' && (
                <Box mt={2}>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  )
}

export default ScanHistory