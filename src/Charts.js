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
        // Aggregate expenses for each month of the current year
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

    // Helper function (copy from App.js or define here)
    const isSubscriptionActiveInMonth = (subscription, monthDate) => {
        const subStartDate = new Date(subscription.startDate);
        const subEndDate = subscription.endDate ? new Date(subscription.endDate) : null;
        const frequency = subscription.frequency || 'monthly';

        // eslint-disable-next-line no-undef
        const monthStart = startOfMonth(monthDate);
        // eslint-disable-next-line no-undef
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

    return (
        <div>
            {/* Line Chart for Monthly Expenses */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
                <h3>Monthly Expenses for {currentMonth.getFullYear()}</h3>
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
                />
            </div>

            {/* Pie Chart for Expenses by Category */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <h3>Expenses by Category for {format(currentMonth, 'MMMM yyyy')}</h3>
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
                />
            </div>
        </div>
    );
};

export default Charts;
