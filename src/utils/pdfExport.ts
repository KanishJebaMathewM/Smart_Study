import jsPDF from 'jspdf';
import { FlashcardDeck, Quiz } from '../types';

export const exportToPDF = {
  flashcardDeck: (deck: FlashcardDeck): void => {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text(deck.name, 20, 30);
    
    // Date
    pdf.setFontSize(12);
    pdf.text(`Created: ${new Date(deck.timestamp).toLocaleDateString()}`, 20, 45);
    
    let yPosition = 65;
    
    deck.flashcards.forEach((card, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Card number
      pdf.setFontSize(14);
      pdf.text(`Card ${index + 1}`, 20, yPosition);
      
      // Question
      pdf.setFontSize(12);
      pdf.text('Q: ', 20, yPosition + 15);
      
      const questionLines = pdf.splitTextToSize(card.question, 160);
      pdf.text(questionLines, 30, yPosition + 15);
      
      const questionHeight = questionLines.length * 7;
      
      // Answer
      pdf.text('A: ', 20, yPosition + 15 + questionHeight + 10);
      
      const answerLines = pdf.splitTextToSize(card.answer, 160);
      pdf.text(answerLines, 30, yPosition + 15 + questionHeight + 10);
      
      const answerHeight = answerLines.length * 7;
      yPosition += 50 + questionHeight + answerHeight;
    });
    
    pdf.save(`${deck.name}.pdf`);
  },

  quiz: (quiz: Quiz): void => {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text(quiz.name, 20, 30);
    
    // Date
    pdf.setFontSize(12);
    pdf.text(`Created: ${new Date(quiz.timestamp).toLocaleDateString()}`, 20, 45);
    
    let yPosition = 65;
    
    quiz.questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Question number
      pdf.setFontSize(14);
      pdf.text(`${index + 1}.`, 20, yPosition);
      
      // Question text
      pdf.setFontSize(12);
      const questionLines = pdf.splitTextToSize(question.question, 160);
      pdf.text(questionLines, 30, yPosition);
      
      const questionHeight = questionLines.length * 7;
      yPosition += questionHeight + 10;
      
      // Options for MCQ
      if (question.type === 'mcq' && question.options) {
        question.options.forEach((option, optIndex) => {
          const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}`;
          pdf.text(optionText, 35, yPosition);
          yPosition += 7;
        });
      }
      
      yPosition += 15;
    });
    
    // Add answer key on new page
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Answer Key', 20, 30);
    
    yPosition = 50;
    quiz.questions.forEach((question, index) => {
      let answer = '';
      if (question.type === 'mcq' && question.options) {
        answer = `${String.fromCharCode(65 + (question.correctAnswer as number))}. ${question.options[question.correctAnswer as number]}`;
      } else {
        answer = question.correctAnswer.toString();
      }
      
      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${answer}`, 20, yPosition);
      yPosition += 10;
    });
    
    pdf.save(`${quiz.name}.pdf`);
  },
};