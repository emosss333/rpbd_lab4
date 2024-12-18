import React, { useState, useEffect } from 'react';
import { RanksCollection, GetRankById } from '../../api/ranks';
import { useNavigate } from 'react-router-dom';

const RanksPage = () => {
  const [ranks, setRanks] = useState([]);
  const [newRank, setNewRank] = useState('');
  const [rankId, setRankId] = useState('');
  const [fetchedRank, setFetchedRank] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedRank, setUpdatedRank] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRanks = () => {
    const subscription = Meteor.subscribe('ranks', {
      onReady: () => {
        const data = RanksCollection.find().fetch();
        setRanks(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  const insertRank = () => {
    if (!newRank) return alert('Введите звание');
    Meteor.call('ranks.insert', { rank: newRank }, () => {
      setNewRank('');
      fetchRanks();
    });
  };

  const openEditModal = (id, currentRank) => {
    setRankId(id);
    setUpdatedRank(currentRank);
    setShowModal(true);
  };

  const updateRank = () => {
    if (updatedRank.trim() === '') return alert('Введите новое звание');
    Meteor.call('ranks.update', rankId, { rank: updatedRank }, () => {
      setShowModal(false);
      fetchRanks();
    });
  };

  const removeRank = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это звание?')) {
      Meteor.call('ranks.remove', id, fetchRanks());
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Ranks</h1>

        <div>
          <h3>Добавить звание</h3>
          <input
            type="text"
            placeholder="Звание"
            value={newRank}
            onChange={(e) => setNewRank(e.target.value)}
          />
          <button onClick={insertRank}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список званий</h3>
        <ul>
          {ranks.map((rank) => (
            <li key={rank._id} style={{ marginBottom: '10px' }}>
              {rank.rank}{' '}
              <button onClick={() => openEditModal(rank._id, rank.rank)}>Изменить</button>
              <button onClick={() => removeRank(rank._id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h2>Редактировать звание</h2>
            <input
              type="text"
              value={updatedRank}
              onChange={(e) => setUpdatedRank(e.target.value)}
              placeholder="Новое звание"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <div>
              <button onClick={updateRank}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RanksPage;
