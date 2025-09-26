import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart } from 'react-google-charts';
import { fetchTaskStatusCounts, fetchDailyTaskCreation, fetchTopUsers } from '../features/analytics/analyticsSlice';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { statusCounts, daily, topUsers } = useSelector((s) => s.analytics || { statusCounts: [], daily: [], topUsers: [] });
  useEffect(() => {
    dispatch(fetchTaskStatusCounts());
    dispatch(fetchDailyTaskCreation());
    dispatch(fetchTopUsers());
  }, [dispatch]);

  const statusChartData = [
    ['Status', 'Count'],
    ...statusCounts.map(item => [item.status, item.count]),
  ];

  const dailyChartData = [
    ['Day', 'Tasks Created'],
    ...daily.map(item => [item.day, item.count]),
  ];

  const topUsersChartData = [
    ['User', 'Tasks Completed'],
    ...topUsers.map(item => [item.name, item.completed]),
  ];

  return (
    <div style={{ maxWidth: 900, margin: '24px auto' }}>
      <h2>Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <section>
          <h3>Task Status Counts</h3>
          {statusCounts.length > 0 ? (
            <Chart
              chartType="PieChart"
              data={statusChartData}
              width="100%"
              height="400px"
              options={{ title: 'Tasks by Status' }}
            />
          ) : <p>No data to display.</p>}
        </section>
        <section>
          <h3>Top Users by Completed Tasks</h3>
          {topUsers.length > 0 ? (
            <Chart
              chartType="BarChart"
              data={topUsersChartData}
              width="100%"
              height="400px"
              options={{ title: 'Top 5 Users' }}
            />
          ) : <p>No data to display.</p>}
        </section>
        <section style={{ gridColumn: '1 / -1' }}>
          <h3>Daily Task Creation</h3>
          {daily.length > 0 ? (
            <Chart
              chartType="LineChart"
              data={dailyChartData}
              width="100%"
              height="400px"
              options={{ title: 'Tasks Created Per Day' }}
            />
          ) : <p>No data to display.</p>}
        </section>
      </div>
    </div>
  );
}
