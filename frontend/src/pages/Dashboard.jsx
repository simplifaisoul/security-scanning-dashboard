import React from 'react'
import { motion } from 'framer-motion'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material'
import {
  Security,
  Speed,
  Timeline,
  Assessment,
  TrendingUp,
  Warning,
} from '@mui/icons-material'

import { useRecentScans, useSystemStats } from '../hooks/useApi'
import ScanHistory from '../components/Scans/ScanHistory'
import QuickActions from '../components/Dashboard/QuickActions'

const Dashboard = () => {
  const { data: recentScans, isLoading: scansLoading } = useRecentScans(5)
  const { data: stats, isLoading: statsLoading } = useSystemStats()

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

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div variants={itemVariants}>
      <Card className="tool-card">
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  {trend > 0 ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <TrendingUp sx={{ color: 'error.main', fontSize: 16, mr: 0.5, transform: 'rotate(180deg)' }} />
                  )}
                  <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                backgroundColor: `${color}.main`,
                borderRadius: 2,
                p: 1,
                color: `${color}.contrastText`,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )

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
            Security Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage your security scanning operations
          </Typography>
        </Box>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Scans"
              value={stats?.totalScans || 0}
              icon={<Assessment />}
              color="primary"
              trend={stats?.scansTrend || 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Scans"
              value={stats?.activeScans || 0}
              icon={<Speed />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed Today"
              value={stats?.completedToday || 0}
              icon={<Timeline />}
              color="success"
              trend={stats?.completionTrend || 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Threats Found"
              value={stats?.threatsFound || 0}
              icon={<Warning />}
              color="error"
              trend={stats?.threatsTrend || 0}
            />
          </Grid>
        </Grid>

        {/* Recent Activity and System Status */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card className="tool-card">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Recent Scans
                  </Typography>
                  <ScanHistory scans={recentScans} loading={scansLoading} />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card className="tool-card">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    System Status
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2">{stats?.systemStatus?.cpu || 0}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats?.systemStatus?.cpu || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2">{stats?.systemStatus?.memory || 0}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats?.systemStatus?.memory || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Disk Usage</Typography>
                      <Typography variant="body2">{stats?.systemStatus?.disk || 0}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats?.systemStatus?.disk || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Tool Status
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      <Chip
                        icon={<Security />}
                        label="Nmap"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="Nikto"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="SQLMap"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="WPScan"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="DIRB"
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="SearchSploit"
                        color="success"
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}

export default Dashboard