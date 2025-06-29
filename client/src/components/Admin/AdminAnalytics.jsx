import React, { useState, useEffect, useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const COLORS = ['#4338ca', '#0891b2', '#059669', '#ca8a04', '#dc2626'];

const AdminAnalytics = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/allData');
        if (!response.ok) throw new Error('Failed to fetch alumni data');
        const data = await response.json();
        setAlumniData(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  const processData = () => {
    const graduationYears = {};
    const companyLocations = {};
    const companies = {};
    const approvalStatus = { Approved: 0, Rejected: 0 };

    alumniData.forEach((alum) => {
      graduationYears[alum.graduationYear] = (graduationYears[alum.graduationYear] || 0) + 1;
      companyLocations[alum.company_location] = (companyLocations[alum.company_location] || 0) + 1;
      companies[alum.company_name] = (companies[alum.company_name] || 0) + 1;
      
      if (alum.isRejected) {
        approvalStatus.Rejected += 1;
      } else {
        approvalStatus.Approved += 1;
      }
    });

    return {
      graduationYears,
      companyLocations,
      companies,
      approvalStatus
    };
  };

  const chartData = useMemo(() => {
    const data = processData();
    
    return {
      graduationYear: {
        labels: Object.keys(data.graduationYears),
        datasets: [{
          label: 'Alumni Count',
          data: Object.values(data.graduationYears),
          backgroundColor: COLORS[0],
          borderColor: COLORS[0],
          borderWidth: 1
        }]
      },
      companyLocation: {
        labels: Object.keys(data.companyLocations),
        datasets: [{
          data: Object.values(data.companyLocations),
          backgroundColor: COLORS,
          borderWidth: 1
        }]
      },
      companies: {
        labels: Object.keys(data.companies),
        datasets: [{
          data: Object.values(data.companies),
          backgroundColor: COLORS,
          borderWidth: 1
        }]
      },
      approvalStatus: {
        labels: Object.keys(data.approvalStatus),
        datasets: [{
          data: Object.values(data.approvalStatus),
          backgroundColor: ['#22c55e', '#ef4444'],
          borderWidth: 1
        }]
      }
    };
  }, [alumniData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-lg">Loading analytics...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-lg text-red-600">Error: {error}</p>
    </div>
  );

  return (
    <div className="space-y-6 p-6 mt-[75px]">
      <h1 className="text-3xl font-bold mb-8">Alumni Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Graduation Year Distribution</h2>
          </div>
          <div className="h-64">
            <Bar data={chartData.graduationYear} options={barOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Company Location Distribution</h2>
          </div>
          <div className="h-64">
            <Pie data={chartData.companyLocation} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Company-wise Distribution</h2>
          </div>
          <div className="h-64">
            <Pie data={chartData.companies} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Approval Status</h2>
          </div>
          <div className="h-64">
            <Pie data={chartData.approvalStatus} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;