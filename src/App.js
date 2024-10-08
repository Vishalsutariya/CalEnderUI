// src/App.js
import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  CssBaseline,
  Container,
  Typography,
  Fab,
  Card,
  CardContent,
  Button,
  ButtonBase,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { startOfMonth, endOfMonth } from 'date-fns';
// import theme from './theme';
import AddSubscriptionModal from './AddSubscriptionModal';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Header from './Header';
import Calendar from './Calendar';
import Charts from './Charts';
import { ColorModeContext } from './ColorModeContext';
import getDesignTokens from './theme';



function App() {
  const { user } = useContext(AuthContext);
  const { mode } = useContext(ColorModeContext);
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    } else {
      setSubscriptions([]);
    }
  }, [user]);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/subscriptions`,
        { withCredentials: true }
      );
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  function isSubscriptionActiveInMonth(subscription, monthDate) {
    const subStartDate = new Date(subscription.startDate);
    const subEndDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const frequency = subscription.frequency || 'monthly';

    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Check if subscription period overlaps with the current month
    const isAfterStart = subStartDate <= monthEnd;
    const isBeforeEnd = subEndDate ? subEndDate >= monthStart : true;

    if (!isAfterStart || !isBeforeEnd) {
      return false;
    }

    if (frequency === 'monthly') {
      // Subscription recurs monthly
      return true;
    } else if (frequency === 'yearly') {
      // Subscription recurs yearly on the same month and day
      return (
        subStartDate.getDate() <= monthEnd.getDate() &&
        subStartDate.getMonth() === monthDate.getMonth()
      );
    } else if (frequency === 'one-time') {
      // One-time subscription
      return (
        subStartDate >= monthStart &&
        subStartDate <= monthEnd
      );
    } else {
      // Handle other frequencies if any
      return false;
    }
  }

  const calculateTotalAmountsByCurrency = () => {
    const totals = {};
    subscriptions.forEach(sub => {
      if (isSubscriptionActiveInMonth(sub, currentMonth)) {
        const currency = sub.currency || 'Unknown';
        totals[currency] = (totals[currency] || 0) + (sub.amount || 0);
      }
    });
    return totals;
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h5" align="center">
            Please log in to view your subscriptions.
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  const totalsByCurrency = calculateTotalAmountsByCurrency();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card
          sx={{
            mb: 4,
            mx: { xs: 2, md: 0 },
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <ButtonBase
            onClick={() => setShowCharts(true)}
            sx={{ width: '100%', textAlign: 'inherit' }}
          >
            <CardContent>
              <Typography variant="h6" align="center">
                Total Subscription Amount for{' '}
                {currentMonth.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
              {Object.keys(totalsByCurrency).length > 0 ? (
                Object.keys(totalsByCurrency).map(currency => (
                  <Typography key={currency} variant="subtitle1" align="center">
                    {currency}: {totalsByCurrency[currency].toFixed(2)}
                  </Typography>
                ))
              ) : (
                <Typography variant="subtitle1" align="center">
                  No active subscriptions this month.
                </Typography>
              )}
            </CardContent>
          </ButtonBase>
        </Card>


        {showCharts ? (
          // Show Charts View
          <>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowCharts(false)}
              sx={{ mb: 2 }}
            >
              Back to Calendar
            </Button>
            <Charts subscriptions={subscriptions} currentMonth={currentMonth} />
          </>
        ) : (
          // Show Calendar View
          <>
            <Calendar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              fetchSubscriptions={fetchSubscriptions}
            />
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setAddModalOpen(true)}
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
              <AddIcon />
            </Fab>
            <AddSubscriptionModal
              open={isAddModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSave={async newSubscription => {
                try {
                  const response = await axios.post(
                    `${apiUrl}/api/subscriptions`,
                    newSubscription,
                    { withCredentials: true }
                  );
                  setSubscriptions([...subscriptions, response.data]);
                  setAddModalOpen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
