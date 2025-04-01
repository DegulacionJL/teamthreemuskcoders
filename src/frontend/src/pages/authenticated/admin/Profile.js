import { Container } from '@mui/material';
import ProfileContent from 'components/organisms/ProfileContent';
import Admin from 'components/pages/Admin';

export default function AdminProfile() {
  return (
    <Admin>
      <Container maxWidth="lg">
        <ProfileContent />
      </Container>
    </Admin>
  );
}
