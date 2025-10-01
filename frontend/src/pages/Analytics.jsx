import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { fetchTaskStatusCounts, fetchDailyTaskCreation, fetchTopUsers } from '../features/analytics/analyticsSlice';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { statusCounts, daily, topUsers } = useSelector((s) => s.analytics || { statusCounts: [], daily: [], topUsers: [] });
  useEffect(() => {
    dispatch(fetchTaskStatusCounts());
    dispatch(fetchDailyTaskCreation());
    dispatch(fetchTopUsers());
  }, [dispatch]);

  const statusColors = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div style={{ maxWidth: 900, margin: '24px auto' }}>
      <h2>Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <section>
          <h3>Completed vs Pending</h3>
          {statusCounts.length > 0 ? (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusCounts} dataKey="count" nameKey="status" outerRadius={120} label>
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <RTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <p>No data to display.</p>}
        </section>
        <section>
          <h3>Task distribution per project</h3>
          {topUsers.length > 0 ? (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <BarChart data={topUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RTooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p>No data to display.</p>}
        </section>
        <section style={{ gridColumn: '1 / -1' }}>
          <h3>Productivity trend over time</h3>
          {daily.length > 0 ? (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <LineChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Tasks" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p>No data to display.</p>}
        </section>
      </div>
    </div>
  );
}
