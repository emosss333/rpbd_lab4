import React, { useState, useEffect } from 'react';
import { GroupsCollection, GetGroupById } from '../../api/groups';
import { useNavigate } from 'react-router-dom';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [groupId, setGroupId] = useState('');
  const [fetchedGroup, setFetchedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchGroups = () => {
    const subscription = Meteor.subscribe('groups', {
      onReady: () => {
        const data = GroupsCollection.find().fetch();
        setGroups(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const insertGroup = () => {
    if (!newGroup) return alert('Введите название группы');
    Meteor.call('groups.insert', { group_name: newGroup }, () => {
      setNewGroup('');
      fetchGroups();
    });
  };

  const openEditModal = (id, currentName) => {
    setGroupId(id);
    setUpdatedName(currentName);
    setShowModal(true);
  };

  const updateGroup = () => {
    if (updatedName.trim() === '') return alert('Введите новое название группы');
    Meteor.call('groups.update', groupId, { group_name: updatedName }, () => {
      setShowModal(false);
      fetchGroups();
    });
  };

  const removeGroup = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      Meteor.call('groups.remove', id, fetchGroups());
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Groups</h1>

        <div>
          <h3>Добавить группу</h3>
          <input
            type="text"
            placeholder="Название группы"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          />
          <button onClick={insertGroup}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список групп</h3>
        <ul>
          {groups.map((group) => (
            <li key={group._id} style={{ marginBottom: '10px' }}>
              {group.group_name}{' '}
              <button onClick={() => openEditModal(group._id, group.group_name)}>Изменить</button>
              <button onClick={() => removeGroup(group._id)}>Удалить</button>
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
            <h2>Редактировать группу</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Новое название группы"
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
              <button onClick={updateGroup}>Сохранить</button>
              <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
