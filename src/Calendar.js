// src/Calendar.js
import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import {
  Grid,
  Typography,
  IconButton,
  Paper,
  Box,
  Tooltip,
  Modal,
  Button,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import EditSubscriptionModal from './EditSubscriptionModal';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const Calendar = ({
  currentMonth,
  setCurrentMonth,
  subscriptions,
  setSubscriptions,
  fetchSubscriptions,
}) => {
  //   const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState(null);
  const theme = useTheme();

  // Handlers for navigating months
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  // Handle date click to show subscription details
  const onDateClick = day => {
    setSelectedDate(day);

    const daySubscriptions = subscriptions.filter(sub => {
      const subStartDate = new Date(sub.startDate);
      const subEndDate = sub.endDate ? new Date(sub.endDate) : null;
      const isAfterStart = isSameDay(day, subStartDate) || day > subStartDate;
      const isBeforeEnd = subEndDate ? day <= subEndDate : true;
      const frequency = sub.frequency || 'monthly';

      if (!isAfterStart || !isBeforeEnd) {
        return false;
      }

      if (frequency === 'monthly') {
        return subStartDate.getDate() === day.getDate();
      } else if (frequency === 'yearly') {
        return (
          subStartDate.getDate() === day.getDate() &&
          subStartDate.getMonth() === day.getMonth()
        );
      } else {
        return isSameDay(day, subStartDate);
      }
    });

    if (daySubscriptions.length > 0) {
      setModalContent(daySubscriptions);
      setIsOpen(true);
    }
  };


  const handleEdit = sub => {
    setSubscriptionToEdit(sub);
    setEditModalOpen(true);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5001/api/subscriptions/${id}`, {
        withCredentials: true,
      });
      setSubscriptions(prevSubs => prevSubs.filter(sub => sub._id !== id));
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Render the header with navigation
  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <IconButton onClick={prevMonth}>
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="h5">{format(currentMonth, dateFormat)}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={nextMonth}>
            <ArrowForwardIos />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  // Render the days of the week
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE'; // Short day format
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(format(addDays(startDate, i), dateFormat));
    }

    return (
      <Grid container>
        {days.map((day, index) => (
          <Grid item xs={1.714} key={index}>
            <Typography
              align="center"
              variant="subtitle1"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render the cells of the calendar
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;

        // Find subscriptions that occur on this day
        const daySubscriptions = subscriptions.filter(sub => {
          const subStartDate = new Date(sub.startDate);
          const subEndDate = sub.endDate ? new Date(sub.endDate) : null;
          const isOngoing = sub.ongoing;
          const frequency = sub.frequency || 'monthly';

          // Check if the subscription is active on this day
          const isAfterStart = isSameDay(day, subStartDate) || day > subStartDate;
          const isBeforeEnd = subEndDate ? day <= subEndDate : true;

          if (!isAfterStart || !isBeforeEnd) {
            return false;
          }

          // Check recurrence
          if (frequency === 'monthly') {
            return subStartDate.getDate() === day.getDate();
          } else if (frequency === 'yearly') {
            return (
              subStartDate.getDate() === day.getDate() &&
              subStartDate.getMonth() === day.getMonth()
            );
          } else {
            // For other frequencies or one-time subscriptions
            return isSameDay(day, subStartDate);
          }
        });

        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <Grid item xs={1.714} key={day.toString()}>
            <Tooltip
              title={
                daySubscriptions.length > 0
                  ? daySubscriptions.map(sub => sub.name).join(', ')
                  : ''
              }
              arrow
              placement="top"
            >
              <Paper
                elevation={3}
                onClick={() => onDateClick(cloneDay)}
                sx={{
                  height: { xs: 80, sm: 100 },
                  backgroundColor: isSelected
                    ? theme.palette.primary.light
                    : isCurrentMonth
                      ? theme.palette.background.paper
                      : theme.palette.action.hover,
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {formattedDate}
                  </Typography>
                </Box>
                {daySubscriptions.length > 0 && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: 'secondary.main',
                      borderRadius: '50%',
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                    }}
                  />
                )}
              </Paper>
            </Tooltip>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day.toString()}>
          {days}
        </Grid>
      );
      days = [];
    }
    return <>{rows}</>;
  };

  return (
    <>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <Modal
        open={modalIsOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Subscriptions on {format(selectedDate, 'MMMM d, yyyy')}
          </Typography>
          <Box id="modal-description" sx={{ mt: 2 }}>
            {modalContent.map(sub => (
              <Box key={sub._id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  <strong>{sub.name}</strong>
                </Typography>
                <Typography variant="body2">{sub.description || 'No description'}</Typography>
                <Typography variant="body2">Category: {sub.category}</Typography>
                <Typography variant="body2">
                  Amount: {sub.amount} {sub.currency}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button onClick={() => handleEdit(sub)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(sub._id)} color="error">
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          <Button onClick={() => setIsOpen(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
      {subscriptionToEdit && (
        <EditSubscriptionModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={async updatedSubscription => {
            try {
              const response = await axios.put(
                `http://localhost:5001/api/subscriptions/${updatedSubscription._id}`,
                updatedSubscription,
                { withCredentials: true }
              );
              setSubscriptions(prevSubs =>
                prevSubs.map(sub =>
                  sub._id === updatedSubscription._id ? response.data : sub
                )
              );
              setEditModalOpen(false);
              setIsOpen(false);
            } catch (err) {
              console.error(err);
            }
          }}
          subscription={subscriptionToEdit}
        />
      )}
    </>
  );
};

export default Calendar;
