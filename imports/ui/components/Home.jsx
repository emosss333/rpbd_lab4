import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Если пользователь не залогинен, редиректим на страницу логина
  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    Meteor.logout(() => {
      navigate('/login');
    });
  };

  const tables = [
    { name: 'Faculties', path: '/faculties' },
    { name: 'Groups', path: '/groups' },
    { name: 'Students', path: '/students' },
    { name: 'Grades', path: '/grades' },
    { name: 'Degrees', path: '/degrees' },
    { name: 'Departments', path: '/departments' },
    { name: 'Ranks', path: '/ranks' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Theses', path: '/theses' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Управление таблицами</h1>
      <div>
        {tables.map((table) => (
          <button
            key={table.path}
            style={{
              margin: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            onClick={() => navigate(table.path)}
          >
            {table.name}
          </button>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
