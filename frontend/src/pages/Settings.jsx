import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Security,
  Notifications,
  Storage,
  Speed,
  DarkMode,
  Language,
} from '@mui/icons-material'

const Settings = () => {
  const [settings, setSettings] = React.useState({
    // General
    darkMode: true,
    language: 'en',
    autoSave: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    auditLogging: true,
    
    // Notifications
    emailNotifications: true,
    scanCompleteNotifications: true,
    threatAlerts: true,
    
    // Performance
    maxConcurrentScans: 3,
    scanTimeout: 300,
    cacheResults: true,
    
    // Storage
    retentionDays: 30,
    autoCleanup: false,
    exportFormat: 'json',
  })

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', settings)
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your security tools application
          </Typography>
        </Box>

        {/* Settings Sections */}
        <Box>
          {/* General Settings */}
          <motion.div variants={itemVariants}>
            <Card className="tool-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Settings sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">General Settings</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('general', 'darkMode', e.target.checked)}
                      />
                    }
                    label="Dark Mode"
                  />

                  <TextField
                    select
                    label="Language"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 200 }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </TextField>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('general', 'autoSave', e.target.checked)}
                      />
                    }
                    label="Auto-save scan configurations"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div variants={itemVariants}>
            <Card className="tool-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Security sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">Security Settings</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />

                  <TextField
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    sx={{ minWidth: 200 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.auditLogging}
                        onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                      />
                    }
                    label="Enable Audit Logging"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div variants={itemVariants}>
            <Card className="tool-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Notifications sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">Notifications</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.scanCompleteNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'scanCompleteNotifications', e.target.checked)}
                      />
                    }
                    label="Scan Complete Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.threatAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'threatAlerts', e.target.checked)}
                      />
                    }
                    label="Threat Alerts"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Settings */}
          <motion.div variants={itemVariants}>
            <Card className="tool-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Speed sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">Performance</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Max Concurrent Scans"
                    type="number"
                    value={settings.maxConcurrentScans}
                    onChange={(e) => handleSettingChange('performance', 'maxConcurrentScans', parseInt(e.target.value))}
                    sx={{ minWidth: 200 }}
                  />

                  <TextField
                    label="Scan Timeout (seconds)"
                    type="number"
                    value={settings.scanTimeout}
                    onChange={(e) => handleSettingChange('performance', 'scanTimeout', parseInt(e.target.value))}
                    sx={{ minWidth: 200 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.cacheResults}
                        onChange={(e) => handleSettingChange('performance', 'cacheResults', e.target.checked)}
                      />
                    }
                    label="Cache scan results"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Storage Settings */}
          <motion.div variants={itemVariants}>
            <Card className="tool-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Storage sx={{ color: 'primary.main' }} />
                  <Typography variant="h5">Storage</Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Data Retention (days)"
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => handleSettingChange('storage', 'retentionDays', parseInt(e.target.value))}
                    sx={{ minWidth: 200 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoCleanup}
                        onChange={(e) => handleSettingChange('storage', 'autoCleanup', e.target.checked)}
                      />
                    }
                    label="Auto-cleanup old data"
                  />

                  <TextField
                    select
                    label="Default Export Format"
                    value={settings.exportFormat}
                    onChange={(e) => handleSettingChange('storage', 'exportFormat', e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{ minWidth: 200 }}
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                    <option value="xml">XML</option>
                  </TextField>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div variants={itemVariants}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => {/* Reset to defaults */}}>
                Reset to Defaults
              </Button>
              <Button variant="contained" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </Box>
          </motion.div>

          {/* Success Message */}
          <motion.div variants={itemVariants}>
            <Alert severity="success" sx={{ mt: 2 }}>
              Settings saved successfully!
            </Alert>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  )
}

export default Settings