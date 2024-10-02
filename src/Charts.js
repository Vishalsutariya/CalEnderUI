// src/Charts.js
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  format,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { Grid, Typography, Box } from '@mui/material'; // Import Material UI components

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Charts = ({ subscriptions, currentMonth }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    prepareMonthlyData();
    prepareCategoryData();
  }, [subscriptions, currentMonth]);

  const prepareMonthlyData = () => {
    const yearStart = startOfYear(currentMonth);
    const yearEnd = endOfYear(currentMonth);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const data = months.map(month => {
      const total = subscriptions.reduce((sum, sub) => {
        if (isSubscriptionActiveInMonth(sub, month)) {
          return sum + (sub.amount || 0);
        }
        return sum;
      }, 0);
      return {
        month: format(month, 'MMM'),
        total,
      };
    });

    setMonthlyData(data);
  };

  const prepareCategoryData = () => {
    const data = {};
    subscriptions.forEach(sub => {
      if (isSubscriptionActiveInMonth(sub, currentMonth)) {
        const category = sub.category || 'Uncategorized';
        data[category] = (data[category] || 0) + (sub.amount || 0);
      }
    });
    setCategoryData(data);
  };

  const isSubscriptionActiveInMonth = (subscription, monthDate) => {
    const subStartDate = new Date(subscription.startDate);
    const subEndDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const frequency = subscription.frequency || 'monthly';

    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const isAfterStart = subStartDate <= monthEnd;
    const isBeforeEnd = subEndDate ? subEndDate >= monthStart : true;

    if (!isAfterStart || !isBeforeEnd) {
      return false;
    }

    if (frequency === 'monthly') {
      return true;
    } else if (frequency === 'yearly') {
      return (
        subStartDate.getDate() <= monthEnd.getDate() &&
        subStartDate.getMonth() === monthDate.getMonth()
      );
    } else if (frequency === 'one-time') {
      return subStartDate >= monthStart && subStartDate <= monthEnd;
    } else {
      return false;
    }
  };

  const currentYear = currentMonth.getFullYear();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Line Chart for Monthly Expenses */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" align="center" gutterBottom>
            Monthly Expenses for {currentYear}
          </Typography>
          <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
            <Line
              data={{
                labels: monthlyData.map(data => data.month),
                datasets: [
                  {
                    label: 'Total Expenses',
                    data: monthlyData.map(data => data.total),
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(75,192,192,1)',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          </Box>
        </Grid>

        {/* Pie Chart for Expenses by Category */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" align="center" gutterBottom>
            Expenses by Category for {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
            <Pie
              data={{
                labels: Object.keys(categoryData),
                datasets: [
                  {
                    data: Object.values(categoryData),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#8BC34A',
                      '#9C27B0',
                      '#FF9800',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Charts;
