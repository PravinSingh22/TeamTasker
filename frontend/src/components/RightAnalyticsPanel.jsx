import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { fetchTaskStatusCounts, fetchDailyTaskCreation, fetchTopUsers } from '../features/analytics/analyticsSlice';

const themeColors = {
  dark: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'], // Indigo, Green, Amber, Red
  light: ['#4f46e5', '#16a34a', '#d97706', '#dc2626'], // Darker shades for better contrast on light bg
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-recharts-tooltip">
        <p className="label">{label || payload[0].name}</p>
        {payload.map((p, i) => (
          <p key={i} className="intro" style={{ color: p.color }}>
            {`${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatusPieChart({ data, colors }) {
  return (
    <section className="analytics-section">
      <h4>Tasks by Status</h4>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={10} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function TopUsersBarChart({ data, colors }) {
  return (
    <section className="analytics-section">
      <h4>Top Users by Completed Tasks</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" fontSize={11} tick={{ fill: 'var(--muted)' }} />
            <YAxis fontSize={11} tick={{ fill: 'var(--muted)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.1)' }} />
            <Bar dataKey="completed" name="Completed" fill={colors[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ProductivityLineChart({ data, colors }) {
  return (
    <section className="analytics-section">
      <h4>Productivity Trend</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" fontSize={11} tick={{ fill: 'var(--muted)' }} />
            <YAxis fontSize={11} tick={{ fill: 'var(--muted)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
            <Line type="monotone" dataKey="count" name="Tasks Created" stroke={colors[0]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function RightAnalyticsPanel() {
  const dispatch = useDispatch();
  const { statusCounts, daily, topUsers } = useSelector((s) => s.analytics || { statusCounts: [], daily: [], topUsers: [] });
  const theme = typeof document !== 'undefined' ? document.documentElement.dataset.theme || 'dark' : 'dark';

  const colors = useMemo(() => themeColors[theme], [theme]);

  useEffect(() => {
    dispatch(fetchTaskStatusCounts());
    dispatch(fetchDailyTaskCreation());
    dispatch(fetchTopUsers());
  }, [dispatch]);

  return (
    <aside className="sidebar analytics-sidebar">
      <div className="sidebar-header">
        <h3>Analytics</h3>
      </div>
      {statusCounts.length > 0 && <StatusPieChart data={statusCounts} colors={colors} />}
      {topUsers.length > 0 && <TopUsersBarChart data={topUsers} colors={colors} />}
      {daily.length > 0 && <ProductivityLineChart data={daily} colors={colors} />}
    </aside>
  );
}
