// src/components/admin/Statistics.js
import React from 'react';

const Statistics = ({ stats }) => {
  const statCards = [
    {
      title: 'Total de Tests',
      value: stats.total_tests || 0,
      icon: 'bi-clipboard-data',
      color: 'primary',
      description: 'Tests completados'
    },
    {
      title: 'Edad Promedio',
      value: stats.promedio_edad ? `${stats.promedio_edad} años` : 'N/A',
      icon: 'bi-people',
      color: 'success',
      description: 'Edad promedio de usuarios'
    },
    {
      title: 'Escuelas',
      value: stats.escuelas?.length || 0,
      icon: 'bi-building',
      color: 'info',
      description: 'Instituciones diferentes'
    }
  ];

  return (
    <div className="row">
      {statCards.map((stat, index) => (
        <div key={index} className="col-md-4 mb-4">
          <div className={`card stat-card border-${stat.color}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-2">{stat.title}</h6>
                  <h3 className={`text-${stat.color} fw-bold`}>{stat.value}</h3>
                  <small className="text-muted">{stat.description}</small>
                </div>
                <div className={`stat-icon bg-${stat.color}`}>
                  <i className={`bi ${stat.icon}`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;