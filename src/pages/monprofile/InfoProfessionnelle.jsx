import { useContext } from 'react';
import {
  WorkRounded,
  Apartment,
  Badge,
  Edit,
} from '@mui/icons-material';
import {
  Box,
  Grid,
} from '@mui/material';
import { UserContext } from '../../utils/UserContext';
import { InfoItem, InfoSection } from './SectionComponent';

export const InfoProfessionnelle = () => {
  const { user } = useContext(UserContext);

  return (
    <Grid size={{xs:12, md:6}}>
      <InfoSection icon={<WorkRounded />} title="Informations professionnelles">
        <Box display="flex" flexDirection="column" gap={2}>
          <InfoItem iconStart={<WorkRounded />}  iconEnd={<Edit />} field="fonction" labelText='Fonction' />
          {/* <InfoItem iconStart={<Apartment />}  iconEnd={<Edit />} field="service" labelText='Service' /> */}
          <InfoItem iconStart={<Badge />}  iconEnd={<Edit />} field="matricule_professionnel" labelText='Numéro Matricule' />
        </Box>
      </InfoSection>
    </Grid>
  );
};
