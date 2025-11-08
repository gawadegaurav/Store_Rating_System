import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stores/owner/ratings');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="owner-dashboard">
      <h2 className="dashboard-title">Owner Dashboard</h2>

      {data.length === 0 ? (
        <p className="no-data">No store ratings available.</p>
      ) : (
        data.map(store => (
          <div key={store.storeId} className="store-card">
            <div className="store-header">
              <h3 className="store-name">{store.storeName}</h3>
              <span className="average-rating">
                ⭐ Average: {store.averageRating ?? 'N/A'}
              </span>
            </div>
            <ul className="rating-list">
              {store.ratings.map(rating => (
                <li key={rating.userId} className="rating-item">
                  <div className="user-info">
                    <strong>{rating.userName}</strong> ({rating.userEmail})
                  </div>
                  <div className="user-rating">Rating: {rating.rating}</div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
