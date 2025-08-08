import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FlashcardPreviewPage from './pages/FlashcardPreviewPage';
import QuizPreviewPage from './pages/QuizPreviewPage';
import StudyModePage from './pages/StudyModePage';
import QuizAttemptPage from './pages/QuizAttemptPage';
import DecksPage from './pages/DecksPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preview/flashcards" element={<FlashcardPreviewPage />} />
          <Route path="/preview/quiz" element={<QuizPreviewPage />} />
          <Route path="/study" element={<StudyModePage />} />
          <Route path="/quiz" element={<QuizAttemptPage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;