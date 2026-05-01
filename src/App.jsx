import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Name from './pages/Name.jsx';
import Birthday from './pages/Birthday.jsx';
import Question from './pages/Question.jsx';
import Focus from './pages/Focus.jsx';
import Home from './pages/Home.jsx';
import Predict from './pages/Predict.jsx';
import Tarot from './pages/Tarot.jsx';
import TarotResult from './pages/TarotResult.jsx';
import Profile from './pages/Profile.jsx';
import Compatibility from './pages/Compatibility.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/name" element={<Name />} />
      <Route path="/birthday" element={<Birthday />} />
      <Route path="/question" element={<Question />} />
      <Route path="/focus" element={<Focus />} />
      <Route path="/home" element={<Home />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/tarot" element={<Tarot />} />
      <Route path="/tarot-result" element={<TarotResult />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/compatibility" element={<Compatibility />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
