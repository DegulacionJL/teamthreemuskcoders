import { Container } from '@mui/material';
import Admin from '../../../templates/Admin';
import ProfileContent from '../Profile';

export default function AdminProfile() {
  return (
    <Admin>
      <Container maxWidth="lg">
        <ProfileContent />
      </Container>
    </Admin>
  );
}
