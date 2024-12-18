import React, { useState, useEffect } from 'react';
import { TeachersCollection } from '../../api/teachers';
import { DegreesCollection } from '../../api/degrees';
import { RanksCollection } from '../../api/ranks';
import { DepartmentsCollection } from '../../api/departments';
import { useNavigate } from 'react-router-dom';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    teacher_code: '',
    full_name: '',
    degree: '',
    rank: '',
    department: '',
    phone: '',
    email: '',
  });
  const [degrees, setDegrees] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTeacher, setSelectedTeacher] = useState(null); 
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

  const fetchRanks = () => {
    const subscription = Meteor.subscribe('ranks', {
      onReady: () => {
        const data = RanksCollection.find().fetch();
        setRanks(data);
      },
    });
    return () => subscription.stop();
  };

  const fetchDepartments = () => {
    const subscription = Meteor.subscribe('departments', {
      onReady: () => {
        const data = DepartmentsCollection.find().fetch();

        setDepartments(data);
      },
    });
    return () => subscription.stop();
  };

  const fetchTeachers = () => {
    const subscription = Meteor.subscribe('teachers', {
      onReady: () => {
        const data = TeachersCollection.find().fetch();
        setTeachers(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchDegrees();
    fetchRanks();
    fetchDepartments();
    fetchTeachers();
  }, []);

  const insertTeacher = () => {
    if (!newTeacher.teacher_code || !newTeacher.full_name || !newTeacher.degree || !newTeacher.rank || !newTeacher.department) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('teachers.insert', newTeacher, (error, result) => {
      if (error) {
        console.error('Ошибка при добавлении преподавателя:', error);
        alert('Ошибка при добавлении преподавателя');
      } else {
        setNewTeacher({
          teacher_code: '',
          full_name: '',
          degree: '',
          rank: '',
          department: '',
          phone: '',
          email: '',
        });
        fetchTeachers();
      }
    });
  };

  const removeTeacher = (teacherCode) => {
    if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      Meteor.call('teachers.remove', teacherCode, fetchTeachers);
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher); 
    setIsModalOpen(true); 
  };

  const updateTeacher = () => {
    if (!selectedTeacher.full_name || !selectedTeacher.degree || !selectedTeacher.rank || !selectedTeacher.department) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('teachers.update', selectedTeacher.teacher_code, {
      full_name: selectedTeacher.full_name,
      degree: selectedTeacher.degree,
      rank: selectedTeacher.rank,
      department: selectedTeacher.department,
      phone: selectedTeacher.phone,
      email: selectedTeacher.email,
    }, (error, result) => {
      if (error) {
        console.error('Ошибка при обновлении преподавателя:', error);
        alert('Ошибка при обновлении преподавателя');
      } else {
        setIsModalOpen(false); 
        setSelectedTeacher(null); 
        fetchTeachers(); 
      }
    });
  };

  const getDegreeName = (degreeId) => {
    const degree = degrees.find(degree => degree._id === degreeId);
    return degree ? degree.degree : 'Неизвестна';
  };

  const getRankName = (rankId) => {
    const rank = ranks.find(rank => rank._id === rankId);
    return rank ? rank.rank : 'Неизвестно';
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(department => department._id === departmentId);
    return department ? department.department : 'Неизвестно';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Преподавателей</h1>

        <div>
          <h3>Добавить преподавателя</h3>
          <input
            type="text"
            placeholder="Код преподавателя"
            value={newTeacher.teacher_code}
            onChange={(e) => setNewTeacher({ ...newTeacher, teacher_code: e.target.value })}
          />
          <input
            type="text"
            placeholder="ФИО преподавателя"
            value={newTeacher.full_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
          />
          <select
            value={newTeacher.degree}
            onChange={(e) => setNewTeacher({ ...newTeacher, degree: e.target.value })}
          >
            <option value="">Выберите степень</option>
            {degrees.map((degree) => (
              <option key={degree._id} value={degree._id}>
                {degree.degree}
              </option>
            ))}
          </select>
          <select
            value={newTeacher.rank}
            onChange={(e) => setNewTeacher({ ...newTeacher, rank: e.target.value })}
          >
            <option value="">Выберите звание</option>
            {ranks.map((rank) => (
              <option key={rank._id} value={rank._id}>
                {rank.rank}
              </option>
            ))}
          </select>
          <select
            value={newTeacher.department}
            onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
          >
            <option value="">Выберите кафедру</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.department}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Телефон"
            value={newTeacher.phone}
            onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
          />
          <button onClick={insertTeacher}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список преподавателей</h3>
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher.teacher_code} style={{ marginBottom: '10px' }}>
              {teacher.full_name} ({teacher.teacher_code}) — {getDegreeName(teacher.degree)} — {getRankName(teacher.rank)} — {getDepartmentName(teacher.department)} — {teacher.phone} — {teacher.email}
              <button onClick={() => openEditModal(teacher)}>Изменить</button>
              <button onClick={() => removeTeacher(teacher.teacher_code)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedTeacher && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
          }}>
            <h3>Редактировать преподавателя</h3>
            <input
              type="text"
              placeholder="ФИО преподавателя"
              value={selectedTeacher.full_name}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, full_name: e.target.value })}
            />
            <select
              value={selectedTeacher.degree}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, degree: e.target.value })}
            >
              <option value="">Выберите степень</option>
              {degrees.map((degree) => (
                <option key={degree._id} value={degree._id}>
                  {degree.degree}
                </option>
              ))}
            </select>
            <select
              value={selectedTeacher.rank}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, rank: e.target.value })}
            >
              <option value="">Выберите звание</option>
              {ranks.map((rank) => (
                <option key={rank._id} value={rank._id}>
                  {rank.rank}
                </option>
              ))}
            </select>
            <select
              value={selectedTeacher.department}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, department: e.target.value })}
            >
              <option value="">Выберите кафедру</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.department}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Телефон"
              value={selectedTeacher.phone}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Email"
              value={selectedTeacher.email}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
            />
            <div>
              <button onClick={updateTeacher}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
