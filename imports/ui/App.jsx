import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import FacultiesPage from './components/FacultiesPage.jsx';
import GroupsPage from './components/GroupsPage.jsx';
import StudentsPage from './components/StudentsPage.jsx';
import GradesPage from './components/GradesPage.jsx';
import DegreesPage from './components/DegreesPage.jsx';
import DepartmentsPage from './components/DepartmentsPage.jsx';
import RanksPage from './components/RanksPage.jsx';
import TeachersPage from './components/TeachersPage.jsx';
import ThesesPage from './components/ThesesPage.jsx';

export const App = () => (
  <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faculties" element={<FacultiesPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/degrees" element={<DegreesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/ranks" element={<RanksPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/theses" element={<ThesesPage />} />
      </Routes>
    </div>
  </BrowserRouter>
);
