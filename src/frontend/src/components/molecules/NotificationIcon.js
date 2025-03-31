'use client';

import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { markNotificationSeen, searchNotifications } from 'services/notification.service';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import BodyText from 'components/atoms/BodyText';
import NotificationItem from 'components/atoms/NotificationItem';
import { criteria, meta as defaultMeta } from 'config/search';

const NotificationIcon = (props) => {
  const { user, darkMode = false } = props;
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [query, setQuery] = useState(criteria);
  const [meta, setMeta] = useState(defaultMeta);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClickNotification = async (notification) => {
    const { id, type, content, read_at } = notification;

    // mark the notification as seen if not yet seen
    if (read_at === null) {
      await markNotificationSeen(id);
      // update rendered list view
      const updatedList = [...notifications];
      const index = updatedList.findIndex((row) => Number.parseInt(row.id) === Number.parseInt(id));
      updatedList[index].read_at = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
      setNotifications(updatedList);
      // update unread count
      setUnread((prev) => prev - 1);
    }

    // FOR DEMO PURPOSES
    alert(JSON.stringify({ type, content }));

    // ADD YOUR LOGIC HERE ON HOW YOU WILL HANDLE CLICKING A NOTIFICATION ITEM e.g redirect
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, meta, unread } = await searchNotifications(query);
      setNotifications((prev) => [...prev, ...data]);
      setUnread(unread);
      setMeta(meta);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnScroll = (e) => {
    // check if user has scrolled to bottom of notification list
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    // trigger fetch next page
    if (bottom && meta && meta.currentPage < meta.lastPage && loading === false) {
      setQuery({ ...query, page: meta.currentPage + 1 });
    }
  };

  const handleNewNotification = (notification) => {
    // add to very top of the list
    setNotifications((prev) => [notification, ...prev]);
    // increment unread count
    setUnread((prev) => prev + 1);
    toast(t('labels.newNotification'), { type: 'info' });
  };

  useEffect(() => {
    fetchNotifications();
  }, [query]);

  useEffect(() => {
    // Fix the condition: use AND instead of OR
    // Also check if window.Echo exists before using it
    if (user && window.Echo) {
      try {
        // subscribe to private channel & listen to specific event from backend \App\Events\
        window.Echo.private(`user-notification.${user.id}`).listen('NotificationCreated', (e) => {
          const { notification } = e;
          handleNewNotification(notification);
        });

        // clean up connection to avoid duplicate broadcast
        return () => {
          if (window.Echo) {
            window.Echo.private(`user-notification.${user.id}`).stopListening(
              'NotificationCreated'
            );
          }
        };
      } catch (error) {
        console.error('Error setting up Echo listener:', error);
      }
    }
  }, [user]);

  return (
    <Fragment>
      <IconButton aria-describedby={id} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge color="secondary" badgeContent={unread}>
          <NotificationsNoneIcon sx={{ color: darkMode ? 'white' : 'text.primary' }} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 300 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
            <BodyText disableGutter sx={{ fontWeight: 700 }}>
              {t('labels.notifications')}
            </BodyText>
          </Box>

          <Box sx={{ maxHeight: 400, overflowY: 'auto' }} onScroll={handleOnScroll}>
            {notifications.map((notification, key) => (
              <NotificationItem
                key={key}
                notification={notification}
                onClick={handleClickNotification}
              />
            ))}

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {notifications.length < 1 && !loading && (
              <BodyText disableGutter align="center" sx={{ p: 2 }}>
                {t('labels.noNotifications')}
              </BodyText>
            )}
          </Box>
        </Box>
      </Popover>
    </Fragment>
  );
};

NotificationIcon.propTypes = {
  user: PropTypes.object,
  darkMode: PropTypes.bool,
};

export default NotificationIcon;
