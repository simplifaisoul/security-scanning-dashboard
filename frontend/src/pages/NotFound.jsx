import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { Home, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff88, #00cc66)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 600 }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to scanning security tools.
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={() => navigate('/tools')}
            size="large"
          >
            Security Tools
          </Button>
        </Box>

        <Box mt={8}>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please contact support.
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFound