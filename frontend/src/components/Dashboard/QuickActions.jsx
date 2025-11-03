import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Chip,
} from '@mui/material'
import {
  PlayArrow,
  Speed,
  Assessment,
  Security,
} from '@mui/icons-material'

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Quick Network Scan',
      description: 'Fast port scan of common services',
      icon: <Speed />,
      color: '#00ff88',
      action: () => handleQuickScan('nmap'),
    },
    {
      title: 'Web Vulnerability Check',
      description: 'Basic web security assessment',
      icon: <Security />,
      color: '#ff6b35',
      action: () => handleQuickScan('nikto'),
    },
    {
      title: 'View Recent Results',
      description: 'Check latest scan findings',
      icon: <Assessment />,
      color: '#2196f3',
      action: () => handleViewResults(),
    },
  ]

  const handleQuickScan = (tool) => {
    // Navigate to tools page with pre-filled configuration
    window.location.href = `/tools/${tool}`
  }

  const handleViewResults = () => {
    window.location.href = '/results'
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Get started with common security tasks
        </Typography>

        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div variants={itemVariants}>
                <Card
                  className="tool-card"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={3}>
                      <Box
                        sx={{
                          backgroundColor: `${action.color}20`,
                          color: action.color,
                          borderRadius: 2,
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="div" gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {action.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PlayArrow />}
                          sx={{
                            borderColor: action.color,
                            color: action.color,
                            '&:hover': {
                              borderColor: action.color,
                              backgroundColor: `${action.color}10`,
                            },
                          }}
                        >
                          Start
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  )
}

export default QuickActions