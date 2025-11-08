import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './StoreList.css';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [err, setErr] = useState('');

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores', { params: { name: nameFilter, address: addressFilter } });
      setStores(res.data);
    } catch (e) {
      setErr('Failed to load stores');
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const submitRating = async (storeId, value) => {
    try {
      await api.post('/user/submit-rating', { storeId, rating: parseInt(value, 10) });
      await fetchStores();
    } catch (e) {
      setErr('Failed to submit rating');
    }
  };

  return (
    <div className="store-container">
      <h2 className="store-title">Stores</h2>

      <div className="store-filters">
        <input
          className="store-input"
          placeholder="Search name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
        />
        <input
          className="store-input"
          placeholder="Search address"
          value={addressFilter}
          onChange={e => setAddressFilter(e.target.value)}
        />
        <button className="store-btn" onClick={fetchStores}>Search</button>
      </div>

      {err && <div className="store-error">{err}</div>}

      <div className="store-table-container">
        <table className="store-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.averageRating ?? 'N/A'}</td>
                <td>{s.userRating ?? 'Not Rated'}</td>
                <td>
                  <select
                    defaultValue={s.userRating ?? ''}
                    onChange={e => submitRating(s.id, e.target.value)}
                    className="store-select"
                  >
                    <option value="">-- rate --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <small className="store-note"> (choose to submit/update)</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
