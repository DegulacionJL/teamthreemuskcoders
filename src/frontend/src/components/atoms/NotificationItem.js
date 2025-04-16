import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import BodyText from 'components/atoms/BodyText';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const NotificationItem = (props) => {
  const { notification, onClick } = props;
  const { content, created_at, read_at } = notification;

  const time = dayjs.utc(created_at);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'top',
        cursor: 'pointer',
        '&:hover': { background: '#f8f8f8' },
      }}
      onClick={() => onClick(notification)}
    >
      <Box sx={{ px: 1, pt: 2 }}>
        {read_at === null && (
          <Box
            sx={(theme) => ({
              display: 'block',
              background: theme.palette.primary.main,
              width: 6,
              height: 6,
              borderRadius: '50%',
              mt: 2,
            })}
          />
        )}
      </Box>
      <Box sx={{ flexGrow: '1', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <BodyText disableGutter sx={{ fontSize: 12, fontWeight: read_at ? 400 : 700 }}>
          {content}
        </BodyText>
        <BodyText disableGutter color="text.secondary" sx={{ fontSize: 12 }}>
          {time.fromNow()}
        </BodyText>
      </Box>
    </Box>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    created_at: PropTypes.string,
    read_at: PropTypes.string,
    sender: PropTypes.shape({
      id: PropTypes.number,
      full_name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }),
  onClick: PropTypes.func,
};

export default NotificationItem;
