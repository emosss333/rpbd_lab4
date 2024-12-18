import React, { useState, useEffect } from 'react';
import { ThesesCollection } from '../../api/theses';
import { StudentsCollection } from '../../api/students';
import { TeachersCollection } from '../../api/teachers';
import { useNavigate } from 'react-router-dom';

const ThesesPage = () => {
  const [theses, setTheses] = useState([]);
  const [newThesis, setNewThesis] = useState({
    grade_book: '',
    teacher_code: '',
    topic: '',
  });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Meteor.userId()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStudents = () => {
    const subscription = Meteor.subscribe('students', {
      onReady: () => {
        const data = StudentsCollection.find().fetch();
        setStudents(data);
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

  const fetchTheses = () => {
    const subscription = Meteor.subscribe('theses', {
      onReady: () => {
        const data = ThesesCollection.find().fetch();
        setTheses(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchTheses();
  }, []);

  const insertThesis = () => {
    if (!newThesis.grade_book || !newThesis.teacher_code || !newThesis.topic) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('theses.insert', newThesis, (error, result) => {
      if (error) {
        console.error('Ошибка при добавлении дипломной работы:', error);
        alert('Ошибка при добавлении дипломной работы');
      } else {
        setNewThesis({
          grade_book: '',
          teacher_code: '',
          topic: '',
        });
        fetchTheses();
      }
    });
  };

  const removeThesis = (gradeBook) => {
    if (window.confirm('Вы уверены, что хотите удалить эту дипломную работу?')) {
      Meteor.call('theses.remove', gradeBook, fetchTheses);
    }
  };

  const openEditModal = (thesis) => {
    setSelectedThesis(thesis);
    setIsModalOpen(true);
  };

  const updateThesis = () => {
    if (!selectedThesis.teacher_code || !selectedThesis.topic) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('theses.update', selectedThesis.grade_book, {
      teacher_code: selectedThesis.teacher_code,
      topic: selectedThesis.topic,
    }, (error, result) => {
      if (error) {
        console.error('Ошибка при обновлении дипломной работы:', error);
        alert('Ошибка при обновлении дипломной работы');
      } else {
        setIsModalOpen(false);
        setSelectedThesis(null);
        fetchTheses();
      }
    });
  };

  const getStudentName = (gradeBook) => {
    const student = students.find(student => student.grade_book === gradeBook);
    return student ? student.full_name : 'Неизвестен';
  };

  const getTeacherName = (teacherCode) => {
    const teacher = teachers.find(teacher => teacher.teacher_code === teacherCode);
    return teacher ? teacher.full_name : 'Неизвестен';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Theses</h1>

        <div>
          <h3>Добавить дипломную работу</h3>
          <select
            value={newThesis.grade_book}
            onChange={(e) => setNewThesis({ ...newThesis, grade_book: e.target.value })}
          >
            <option value="">Выберите студента</option>
            {students.map((student) => (
              <option key={student.grade_book} value={student.grade_book}>
                {student.full_name}
              </option>
            ))}
          </select>
          <select
            value={newThesis.teacher_code}
            onChange={(e) => setNewThesis({ ...newThesis, teacher_code: e.target.value })}
          >
            <option value="">Выберите преподавателя</option>
            {teachers.map((teacher) => (
              <option key={teacher.teacher_code} value={teacher.teacher_code}>
                {teacher.full_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Тема дипломной работы"
            value={newThesis.topic}
            onChange={(e) => setNewThesis({ ...newThesis, topic: e.target.value })}
          />
          <button onClick={insertThesis}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список дипломных работ</h3>
        <ul>
          {theses.map((thesis) => (
            <li key={thesis.grade_book} style={{ marginBottom: '10px' }}>
              {getStudentName(thesis.grade_book)} — {getTeacherName(thesis.teacher_code)} — {thesis.topic}
              <button onClick={() => openEditModal(thesis)}>Изменить</button>
              <button onClick={() => removeThesis(thesis.grade_book)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedThesis && (
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
            <h3>Редактировать дипломную работу</h3>
            <select
              value={selectedThesis.teacher_code}
              onChange={(e) => setSelectedThesis({ ...selectedThesis, teacher_code: e.target.value })}
            >
              <option value="">Выберите преподавателя</option>
              {teachers.map((teacher) => (
                <option key={teacher.teacher_code} value={teacher.teacher_code}>
                  {teacher.full_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Тема дипломной работы"
              value={selectedThesis.topic}
              onChange={(e) => setSelectedThesis({ ...selectedThesis, topic: e.target.value })}
            />
            <div>
              <button onClick={updateThesis}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesesPage;