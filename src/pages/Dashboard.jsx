import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const categoryChartData = {
    labels: stats?.furnitureByCategory?.map(item => item.id) || [],
    datasets: [
      {
        label: 'Nombre de meubles',
        data: stats?.furnitureByCategory?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(13, 110, 253, 0.8)',
          'rgba(25, 135, 84, 0.8)',
        ],
        borderColor: [
          'rgba(13, 110, 253, 1)',
          'rgba(25, 135, 84, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  const materialPieData = {
    labels: stats?.materialQuantities?.map(m => m.name) || [],
    datasets: [
      {
        label: 'Quantité disponible',
        data: stats?.materialQuantities?.map(m => m.quantity) || [],
        backgroundColor: stats?.materialQuantities?.map((_, i) => {
          const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#C9CBCF', '#33CC33', '#FF66B2', '#6699FF', '#FF9933', '#66CCCC'
          ];
          return colors[i % colors.length];
        }),
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Dashboard</h1>
      </div>

      <div className="row mb-4">
        <div className="card stats-card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <div className="stats-number">{stats?.totals?.furniture || 0}</div>
                <div className="stats-label">Meubles</div>
              </div>
              <div className="align-self-center">
                <i className="bi bi-archive fs-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-6 col-md-6 mb-4">
          <div className="card" style={{ height: '350px' }}>
            <div className="card-header">
              <h6 className="m-0">Meubles par Catégorie</h6>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Bar data={categoryChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 mb-4">
          <div className="card" style={{ height: '350px' }}>
            <div className="card-header">
              <h6 className="m-0">Quantité des matériaux en stock</h6>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <div>
                <Pie data={materialPieData} />
              </div>
            </div>
          </div>
        </div>
      </div>




      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="m-0">Meubles Récents</h6>
          <Link to="/furniture" className="btn btn-primary btn-sm">
            Voir tous
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentFurniture?.map((furniture) => (
                  <tr key={furniture.id}>
                    <td>
                      {furniture.name}
                    </td>
                    <td>{furniture.category}</td>
                    <td>{new Date(furniture.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;