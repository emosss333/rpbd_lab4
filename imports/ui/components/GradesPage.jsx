import React, { useState, useEffect } from 'react';
import { GradesCollection } from '../../api/grades';
import { StudentsCollection } from '../../api/students';
import { useNavigate } from 'react-router-dom';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState({
    grade_book: '',
    exam_grade: '',
    diploma_grade: '',
  });
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
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

  const fetchGrades = () => {
    const subscription = Meteor.subscribe('grades', {
      onReady: () => {
        const data = GradesCollection.find().fetch();
        setGrades(data);
      },
    });
    return () => subscription.stop();
  };

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const insertGrade = () => {
    if (!newGrade.grade_book || !newGrade.exam_grade || !newGrade.diploma_grade) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('grades.insert', newGrade, (error, result) => {
      if (error) {
        console.error('Ошибка при добавлении оценки:', error);
        alert('Ошибка при добавлении оценки');
      } else {
        setNewGrade({
          grade_book: '',
          exam_grade: '',
          diploma_grade: '',
        });
        fetchGrades();
      }
    });
  };

  const removeGrade = (gradeBook) => {
    if (window.confirm('Вы уверены, что хотите удалить эту оценку?')) {
      Meteor.call('grades.remove', gradeBook, fetchGrades);
    }
  };

  const openEditModal = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const updateGrade = () => {
    if (!selectedGrade.exam_grade || !selectedGrade.diploma_grade) {
      return alert('Пожалуйста, заполните все поля');
    }
    Meteor.call('grades.update', selectedGrade.grade_book, {
      exam_grade: selectedGrade.exam_grade,
      diploma_grade: selectedGrade.diploma_grade,
    }, (error, result) => {
      if (error) {
        console.error('Ошибка при обновлении оценки:', error);
        alert('Ошибка при обновлении оценки');
      } else {
        setIsModalOpen(false);
        setSelectedGrade(null);
        fetchGrades();
      }
    });
  };

  const getStudentName = (gradeBook) => {
    const student = students.find(student => student.grade_book === gradeBook);
    return student ? student.full_name : 'Неизвестен';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
          Назад
        </button>
        <h1>Таблица Grades</h1>

        <div>
          <h3>Добавить оценку</h3>
          <select
            value={newGrade.grade_book}
            onChange={(e) => setNewGrade({ ...newGrade, grade_book: e.target.value })}
          >
            <option value="">Выберите студента</option>
            {students.map((student) => (
              <option key={student.grade_book} value={student.grade_book}>
                {student.full_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Оценка за экзамен"
            value={newGrade.exam_grade}
            onChange={(e) => setNewGrade({ ...newGrade, exam_grade: e.target.value })}
          />
          <input
            type="text"
            placeholder="Оценка за диплом"
            value={newGrade.diploma_grade}
            onChange={(e) => setNewGrade({ ...newGrade, diploma_grade: e.target.value })}
          />
          <button onClick={insertGrade}>Добавить</button>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Список оценок</h3>
        <ul>
          {grades.map((grade) => (
            <li key={grade.grade_book} style={{ marginBottom: '10px' }}>
              {getStudentName(grade.grade_book)} — Экзамен: {grade.exam_grade} — Диплом: {grade.diploma_grade}
              <button onClick={() => openEditModal(grade)}>Изменить</button>
              <button onClick={() => removeGrade(grade.grade_book)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedGrade && (
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
            <h3>Редактировать оценку</h3>
            <input
              type="text"
              placeholder="Оценка за экзамен"
              value={selectedGrade.exam_grade}
              onChange={(e) => setSelectedGrade({ ...selectedGrade, exam_grade: e.target.value })}
            />
            <input
              type="text"
              placeholder="Оценка за диплом"
              value={selectedGrade.diploma_grade}
              onChange={(e) => setSelectedGrade({ ...selectedGrade, diploma_grade: e.target.value })}
            />
            <div>
              <button onClick={updateGrade}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesPage;
