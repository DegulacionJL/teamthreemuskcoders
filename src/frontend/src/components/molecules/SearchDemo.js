import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SearchBox from './SearchBox';

function SearchDemo() {
  const { t } = useTranslation();
  const [selectedResult, setSelectedResult] = useState(null);

  const handleResultSelect = (result) => {
    console.log('Selected result:', result);
    setSelectedResult(result);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('search.title')}
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            {t('search.description')}
          </Typography>

          <Box sx={{ my: 3 }}>
            <SearchBox onResultSelect={handleResultSelect} />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {t('search.hint')}
          </Typography>
        </Paper>

        {selectedResult && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('search.selected_result')}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                {t('search.result_type')}: {selectedResult.type}
              </Alert>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <pre style={{ margin: 0, overflowX: 'auto' }}>
                  {JSON.stringify(selectedResult, null, 2)}
                </pre>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default SearchDemo;
