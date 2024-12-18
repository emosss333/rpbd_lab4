import React, { useState, useEffect } from 'react';
import { FacultiesCollection, GetFacultyById } from '../../api/faculties';
import { useNavigate } from 'react-router-dom';

const FacultiesPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [fetchedFaculty, setFetchedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchFaculties = () => {
    const subscription = Meteor.subscribe('faculties', {
      onReady: () => {
        const data = FacultiesCollection.find().fetch();
        setFaculties(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const insertFaculty = () => {
    if (!newFaculty) return alert('Введите название факультета');
    Meteor.call('faculties.insert', { faculty_name: newFaculty }, () => {
      setNewFaculty('');
      fetchFaculties();
    });
  };

  const openEditModal = (id, currentName) => {
    setFacultyId(id);
    setUpdatedName(currentName);
    setShowModal(true);
  };

  const updateFaculty = () => {
    if (updatedName.trim() === '') return alert('Введите новое название факультета');
    Meteor.call('faculties.update', facultyId, { faculty_name: updatedName }, () => {
      setShowModal(false);
      fetchFaculties();
    });
  };

  const removeFaculty = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот факультет?')) {
      Meteor.call('faculties.remove', id, fetchFaculties());
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Faculties</h1>

        <div>
          <h3>Добавить факультет</h3>
          <input
            type="text"
            placeholder="Название факультета"
            value={newFaculty}
            onChange={(e) => setNewFaculty(e.target.value)}
          />
          <button onClick={insertFaculty}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список факультетов</h3>
        <ul>
          {faculties.map((faculty) => (
            <li key={faculty._id} style={{ marginBottom: '10px' }}>
              {faculty.faculty_name}{' '}
              <button onClick={() => openEditModal(faculty._id, faculty.faculty_name)}>Изменить</button>
              <button onClick={() => removeFaculty(faculty._id)}>Удалить</button>
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
            <h2>Редактировать факультет</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Новое название факультета"
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
              <button onClick={updateFaculty}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultiesPage;
