import React, { useState, useEffect } from 'react';
import { DegreesCollection, GetDegreeById } from '../../api/degrees';
import { useNavigate } from 'react-router-dom';

const DegreesPage = () => {
  const [degrees, setDegrees] = useState([]);
  const [newDegree, setNewDegree] = useState('');
  const [degreeId, setDegreeId] = useState('');
  const [fetchedDegree, setFetchedDegree] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedDegree, setUpdatedDegree] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDegrees = () => {
    const subscription = Meteor.subscribe('degrees', {
      onReady: () => {
        const data = DegreesCollection.find().fetch();
        setDegrees(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  const insertDegree = () => {
    if (!newDegree) return alert('Введите название степени');
    Meteor.call('degrees.insert', { degree: newDegree }, () => {
      setNewDegree('');
      fetchDegrees();
    });
  };

  const openEditModal = (id, currentDegree) => {
    setDegreeId(id);
    setUpdatedDegree(currentDegree);
    setShowModal(true);
  };

  const updateDegree = () => {
    if (updatedDegree.trim() === '') return alert('Введите новое название степени');
    Meteor.call('degrees.update', degreeId, { degree: updatedDegree }, () => {
      setShowModal(false);
      fetchDegrees();
    });
  };

  const removeDegree = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту степень?')) {
      Meteor.call('degrees.remove', id, fetchDegrees());
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Degrees</h1>

        <div>
          <h3>Добавить степень</h3>
          <input
            type="text"
            placeholder="Название степени"
            value={newDegree}
            onChange={(e) => setNewDegree(e.target.value)}
          />
          <button onClick={insertDegree}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список степеней</h3>
        <ul>
          {degrees.map((degree) => (
            <li key={degree._id} style={{ marginBottom: '10px' }}>
              {degree.degree}{' '}
              <button onClick={() => openEditModal(degree._id, degree.degree)}>Изменить</button>
              <button onClick={() => removeDegree(degree._id)}>Удалить</button>
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
            <h2>Редактировать степень</h2>
            <input
              type="text"
              value={updatedDegree}
              onChange={(e) => setUpdatedDegree(e.target.value)}
              placeholder="Новое название степени"
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
              <button onClick={updateDegree}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DegreesPage;
