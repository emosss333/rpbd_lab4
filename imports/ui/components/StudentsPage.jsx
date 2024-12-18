import React, { useState, useEffect } from 'react';
import { StudentsCollection } from '../../api/students';
import { FacultiesCollection } from '../../api/faculties';
import { GroupsCollection } from '../../api/groups'; 
import { useNavigate } from 'react-router-dom';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    grade_book: '',
    full_name: '',
    faculty: '',
    group: '',
  });
  const [faculties, setFaculties] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
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

  const fetchGroups = () => {
    const subscription = Meteor.subscribe('groups', {
      onReady: () => {
        const data = GroupsCollection.find().fetch();
        setGroups(data);
      },
    });
    return () => subscription.stop();
  };

  const fetchStudents = () => {
    const subscription = Meteor.subscribe('students', {
      onReady: () => {
        const data = StudentsCollection.find().fetch();
        setStudents(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchFaculties();
    fetchGroups();
    fetchStudents();
  }, []);

  const insertStudent = () => {
    if (!newStudent.grade_book || !newStudent.full_name || !newStudent.faculty || !newStudent.group) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('students.insert', newStudent, (error, result) => {
      if (error) {
        console.error('Ошибка при добавлении студента:', error);
        alert('Ошибка при добавлении студента');
      } else {
        setNewStudent({
          grade_book: '',
          full_name: '',
          faculty: '',
          group: '',
        });
        fetchStudents();
      }
    });
  };

  const removeStudent = (gradeBook) => {
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      Meteor.call('students.remove', gradeBook, fetchStudents);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student); 
    setIsModalOpen(true); 
  };

  const updateStudent = () => {
    if (!selectedStudent.full_name || !selectedStudent.faculty || !selectedStudent.group) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('students.update', selectedStudent.grade_book, {
      full_name: selectedStudent.full_name,
      faculty: selectedStudent.faculty,
      group: selectedStudent.group,
    }, (error, result) => {
      if (error) {
        console.error('Ошибка при обновлении студента:', error);
        alert('Ошибка при обновлении студента');
      } else {
        setIsModalOpen(false); 
        setSelectedStudent(null); 
        fetchStudents(); 
      }
    });
  };

  const getFacultyName = (facultyId) => {
    const faculty = faculties.find(faculty => faculty._id === facultyId);
    return faculty ? faculty.faculty_name : 'Неизвестен';
  };

  const getGroupName = (groupId) => {
    const group = groups.find(group => group._id === groupId);
    return group ? group.group_name : 'Неизвестна';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Students</h1>

        <div>
          <h3>Добавить студента</h3>
          <input
            type="text"
            placeholder="Номер зачетной книжки"
            value={newStudent.grade_book}
            onChange={(e) => setNewStudent({ ...newStudent, grade_book: e.target.value })}
          />
          <input
            type="text"
            placeholder="ФИО студента"
            value={newStudent.full_name}
            onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
          />
          <select
            value={newStudent.faculty}
            onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })}
          >
            <option value="">Выберите факультет</option>
            {faculties.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.faculty_name}
              </option>
            ))}
          </select>
          <select
            value={newStudent.group}
            onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
          >
            <option value="">Выберите группу</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.group_name}
              </option>
            ))}
          </select>
          <button onClick={insertStudent}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список студентов</h3>
        <ul>
          {students.map((student) => (
            <li key={student.grade_book} style={{ marginBottom: '10px' }}>
              {student.full_name} ({student.grade_book}) — {getFacultyName(student.faculty)} — {getGroupName(student.group)}
              <button onClick={() => openEditModal(student)}>Изменить</button>
              <button onClick={() => removeStudent(student.grade_book)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedStudent && (
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
            <h3>Редактировать студента</h3>
            <input
              type="text"
              placeholder="ФИО студента"
              value={selectedStudent.full_name}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, full_name: e.target.value })}
            />
            <select
              value={selectedStudent.faculty}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, faculty: e.target.value })}
            >
              <option value="">Выберите факультет</option>
              {faculties.map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.faculty_name}
                </option>
              ))}
            </select>
            <select
              value={selectedStudent.group}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, group: e.target.value })}
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.group_name}
                </option>
              ))}
            </select>
            <div>
              <button onClick={updateStudent}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
