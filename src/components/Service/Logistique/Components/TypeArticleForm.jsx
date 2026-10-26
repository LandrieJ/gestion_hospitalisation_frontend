import { useState } from 'react';
import {
  TextField, Button, Grid, Card, CardContent, CardHeader, CardActions, Box
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/QrCode';
import DescriptionIcon from '@mui/icons-material/Description';
import { apiToPost } from '../../../../utils/ApiServices';

export const TypeArticleForm = ({ setSlideSection }) => {
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await apiToPost('logistique/types-articles/', formData);
    setFormData({
      nom: '',
      code: '',
      description: '',
    });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardHeader
          avatar={<CategoryIcon color="primary" />}
          title="Nouveau Type d'Article"
          subheader="Définissez une nouvelle catégorie pour vos articles"
        />
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{xs:12}}>
                <TextField
                  name="nom"
                  label="Nom du type d'article"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <TitleIcon sx={{ mr: 1, color: 'action.active' }} />
                    ),
                  }}
                />
              </Grid>

              <Grid size={{xs:12}}>
                <TextField
                  name="code"
                  label="Code unique"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  helperText="Un code court pour identifier rapidement le type (ex: CONS-MED)"
                  InputProps={{
                    startAdornment: (
                      <CodeIcon sx={{ mr: 1, color: 'action.active' }} />
                    ),
                  }}
                />
              </Grid>

              <Grid size={{xs:12}}>
                <TextField
                  name="description"
                  label="Description (optionnel)"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ mr: 1, mt: '12px', alignSelf: 'flex-start', color: 'action.active' }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button variant="outlined" color="secondary">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Créer le Type
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};