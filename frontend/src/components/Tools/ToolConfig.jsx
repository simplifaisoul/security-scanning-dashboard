import React from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material'

const ToolConfig = ({ tool, config, onConfigChange, toolConfig }) => {
  const handleFieldChange = (fieldName, value) => {
    onConfigChange(fieldName, value)
  }

  const renderField = (field) => {
    const { name, label, type, required, options, default: defaultValue } = field

    switch (type) {
      case 'text':
        return (
          <TextField
            key={name}
            fullWidth
            label={label}
            value={config[name] || defaultValue || ''}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            required={required}
            margin="normal"
            variant="outlined"
          />
        )

      case 'number':
        return (
          <TextField
            key={name}
            fullWidth
            label={label}
            type="number"
            value={config[name] || defaultValue || ''}
            onChange={(e) => handleFieldChange(name, parseInt(e.target.value))}
            required={required}
            margin="normal"
            variant="outlined"
          />
        )

      case 'select':
        return (
          <FormControl key={name} fullWidth margin="normal" variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
              value={config[name] || defaultValue || ''}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {typeof option === 'string' ? option.toUpperCase() : option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      case 'boolean':
        return (
          <FormControlLabel
            key={name}
            control={
              <Switch
                checked={config[name] || defaultValue || false}
                onChange={(e) => handleFieldChange(name, e.target.checked)}
              />
            }
            label={label}
          />
        )

      case 'textarea':
        return (
          <TextField
            key={name}
            fullWidth
            label={label}
            multiline
            rows={4}
            value={config[name] || defaultValue || ''}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            required={required}
            margin="normal"
            variant="outlined"
          />
        )

      default:
        return null
    }
  }

  if (!toolConfig || !toolConfig.fields) {
    return (
      <Box>
        <Typography color="text.secondary">
          No configuration available for this tool.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Configure the parameters for your {tool?.toUpperCase()} scan.
      </Typography>

      <Grid container spacing={2}>
        {toolConfig.fields.map((field) => (
          <Grid item xs={12} md={field.type === 'textarea' ? 12 : 6} key={field.name}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>

      {/* Tool-specific help text */}
      {tool === 'nmap' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(0, 255, 136, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Nmap Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Use "common" for ports to scan top 100 most common ports<br/>
              • SYN scan (-sS) is stealthy but requires root privileges<br/>
              • Timing T3 is normal speed, T5 is very fast but may be detected
            </Typography>
          </CardContent>
        </Card>
      )}

      {tool === 'nikto' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(255, 107, 53, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Nikto Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Always scan with permission from the target owner<br/>
              • Nikto may trigger security alerts on target systems<br/>
              • Results include potential vulnerabilities that need verification
            </Typography>
          </CardContent>
        </Card>
      )}

      {tool === 'sqlmap' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(33, 150, 243, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              SQLMap Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Only test on systems you own or have explicit permission<br/>
              • Start with low risk levels to avoid damaging target systems<br/>
              • SQL injection testing can be detected by intrusion detection systems
            </Typography>
          </CardContent>
        </Card>
      )}

      {tool === 'wpscan' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              WPScan Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Scan only WordPress sites you own or have permission to test<br/>
              • Enumeration can be noisy and may be detected<br/>
              • Consider using API tokens for more reliable scanning
            </Typography>
          </CardContent>
        </Card>
      )}

      {tool === 'dirb' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(255, 152, 0, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              DIRB Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Directory brute-forcing can be very noisy<br/>
              • Use appropriate wordlists to avoid unnecessary requests<br/>
              • Consider rate limiting to avoid overwhelming target servers
            </Typography>
          </CardContent>
        </Card>
      )}

      {tool === 'searchsploit' && (
        <Card sx={{ mt: 2, backgroundColor: 'rgba(244, 67, 54, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              SearchSploit Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Search for specific software versions and vulnerabilities<br/>
              • Results include public exploits and proof-of-concepts<br/>
              • Always verify exploits before use and follow responsible disclosure
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ToolConfig