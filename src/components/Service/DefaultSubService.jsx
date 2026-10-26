import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Alert } from '@mui/material';

export const DefaultSubService = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const serviceName = pathSegments[2] || 'Service';
  const subServiceName = pathSegments[3] || 'Sous-service';

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
          {serviceName} - {subServiceName}
        </Typography>

        <Alert severity="info" sx={{ mt: 2, bgcolor: 'blue.50', borderLeft: '6px solid', borderColor: 'primary.main' }}>
          <Typography variant="body2" color="text.primary">
            Ce service est en cours de développement. L'interface sera bientôt disponible.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Path actuel : {location.pathname}
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};
