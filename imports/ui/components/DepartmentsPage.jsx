import React, { useState, useEffect } from 'react';
import { DepartmentsCollection, GetDepartmentById } from '../../api/departments';
import { useNavigate } from 'react-router-dom';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchDepartments = () => {
    const subscription = Meteor.subscribe('departments', {
      onReady: () => {
        const data = DepartmentsCollection.find().fetch();
        setDepartments(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const insertDepartment = () => {
    if (!newDepartment) return alert('Введите название кафедры');
    Meteor.call('departments.insert', { department: newDepartment }, () => {
      setNewDepartment('');
      fetchDepartments();
    });
  };

  const openEditModal = (id, currentName) => {
    setDepartmentId(id);
    setUpdatedName(currentName);
    setShowModal(true);
  };

  const updateDepartment = () => {
    if (updatedName.trim() === '') return alert('Введите новое название кафедры');
    Meteor.call('departments.update', departmentId, { department: updatedName }, () => {
      setShowModal(false);
      fetchDepartments();
    });
  };

  const removeDepartment = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту кафедру?')) {
      Meteor.call('departments.remove', id, fetchDepartments());
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Departments</h1>

        <div>
          <h3>Добавить кафедру</h3>
          <input
            type="text"
            placeholder="Название кафедры"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button onClick={insertDepartment}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список кафедр</h3>
        <ul>
          {departments.map((department) => (
            <li key={department._id} style={{ marginBottom: '10px' }}>
              {department.department}{' '}
              <button onClick={() => openEditModal(department._id, department.department)}>Изменить</button>
              <button onClick={() => removeDepartment(department._id)}>Удалить</button>
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
            <h2>Редактировать кафедру</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Новое название кафедры"
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
              <button onClick={updateDepartment}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;