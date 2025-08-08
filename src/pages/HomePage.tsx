import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerationType, GenerationOptions, StudyMaterialSource } from '../types';
import { 
  generateFlashcardsFromText, 
  generateQuizFromText, 
  generateFromLargeText 
} from '../utils/aiGenerator';
import { extractTextFromPDF, validatePDFFile, formatFileSize } from '../utils/pdfTextExtractor';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Brain, 
  Zap, 
  Upload, 
  FileText, 
  Settings,
  X,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [noteText, setNoteText] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('flashcards');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // New enhanced options
  const [quantity, setQuantity] = useState(10);
  const [creativity, setCreativity] = useState(0.7);
  const [useAI, setUseAI] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // PDF handling
  const [source, setSource] = useState<StudyMaterialSource>({
    type: 'text',
    content: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validatePDFFile(file)) {
      alert('Please upload a valid PDF file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB.');
      return;
    }

    setIsProcessingPDF(true);
    setUploadedFile(file);

    try {
      const extractedText = await extractTextFromPDF(file);
      setSource({
        type: 'pdf',
        content: extractedText,
        filename: file.name
      });
      setNoteText(extractedText);
    } catch (error) {
      console.error('PDF processing error:', error);
      alert('Failed to extract text from PDF. Please try a different file.');
    } finally {
      setIsProcessingPDF(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setSource({ type: 'text', content: '' });
    setNoteText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextChange = (text: string) => {
    setNoteText(text);
    setSource({ type: 'text', content: text });
    if (uploadedFile) {
      removeFile();
    }
  };

  const getContentForGeneration = () => {
    return source.content || noteText;
  };

  const handleGenerate = async () => {
    const content = getContentForGeneration();
    
    if (!content.trim()) {
      alert('Please enter text or upload a PDF to generate study materials.');
      return;
    }

    if (content.length < 50) {
      alert('Please provide at least 50 characters of content for better results.');
      return;
    }

    setIsGenerating(true);

    try {
      const options: GenerationOptions = {
        quantity,
        creativity,
        useAI
      };

      // For large content (10k+ words), use chunking
      const isLargeContent = content.length > 10000;

      if (generationType === 'flashcards') {
        const flashcards = isLargeContent 
          ? await generateFromLargeText(content, 'flashcards', options) as any[]
          : await generateFlashcardsFromText(content, options);
        
        navigate('/preview/flashcards', { 
          state: { 
            flashcards, 
            originalText: content,
            source: source.filename ? `${source.filename}` : 'Text input'
          } 
        });
      } else if (generationType === 'quizzes') {
        const quiz = isLargeContent
          ? await generateFromLargeText(content, 'quiz', options) as any[]
          : await generateQuizFromText(content, options);
        
        navigate('/preview/quiz', { 
          state: { 
            questions: quiz, 
            originalText: content,
            source: source.filename ? `${source.filename}` : 'Text input'
          } 
        });
      } else {
        // Both - generate flashcards and quiz
        const [flashcards, quiz] = await Promise.all([
          isLargeContent 
            ? generateFromLargeText(content, 'flashcards', options)
            : generateFlashcardsFromText(content, options),
          isLargeContent
            ? generateFromLargeText(content, 'quiz', { ...options, quantity: Math.ceil(quantity / 2) })
            : generateQuizFromText(content, { ...options, quantity: Math.ceil(quantity / 2) })
        ]);
        
        navigate('/preview/flashcards', { 
          state: { 
            flashcards, 
            quiz,
            originalText: content,
            source: source.filename ? `${source.filename}` : 'Text input'
          } 
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate study materials. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToInput = () => {
    document.getElementById('note-input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCreativityLabel = (value: number) => {
    if (value <= 0.3) return 'Conservative';
    if (value <= 0.6) return 'Balanced';
    if (value <= 0.8) return 'Creative';
    return 'Very Creative';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
            Turn Your Notes into{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interactive Study Materials
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Upload PDFs or paste your notes to create AI-powered flashcards & quizzes. 
            Supports large documents (10,000+ words) with customizable creativity levels.
          </p>
          
          <button
            onClick={scrollToInput}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Generation</h3>
              <p className="text-slate-600">
                Advanced AI creates relevant, context-aware flashcards and quizzes from your content.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">PDF Support</h3>
              <p className="text-slate-600">
                Upload PDF documents and automatically extract text for study material generation.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Customizable</h3>
              <p className="text-slate-600">
                Control quantity, creativity level, and question types to match your learning style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Note Input Section */}
      <section id="note-input-section" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              Create Study Materials
            </h2>
            
            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 transition-colors hover:border-slate-400">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {uploadedFile ? (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">{uploadedFile.name}</div>
                        <div className="text-sm text-green-600">{formatFileSize(uploadedFile.size)}</div>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <div className="mb-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingPDF}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {isProcessingPDF ? 'Processing PDF...' : 'Click to upload a PDF'}
                      </button>
                      <span className="text-slate-600"> or drag and drop</span>
                    </div>
                    <p className="text-sm text-slate-500">Maximum file size: 10MB</p>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                    Or paste your study material
                  </label>
                  {noteText.length > 0 && (
                    <div className="text-sm text-slate-500">
                      {noteText.length.toLocaleString()} characters
                      {noteText.length > 10000 && (
                        <span className="ml-2 text-blue-600 font-medium">• Large document mode</span>
                      )}
                    </div>
                  )}
                </div>
                <textarea
                  id="notes"
                  value={noteText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Paste your notes, textbook excerpts, or any study material here. The AI will analyze the content and create interactive study materials for you."
                  className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 leading-relaxed"
                  disabled={isProcessingPDF}
                />
              </div>

              {/* Generation Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  What would you like to generate?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'flashcards', label: 'Flashcards', icon: BookOpen },
                    { value: 'quizzes', label: 'Quizzes', icon: Brain },
                    { value: 'both', label: 'Both', icon: Sparkles },
                  ].map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        generationType === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="generationType"
                        value={value}
                        checked={generationType === value}
                        onChange={(e) => setGenerationType(e.target.value as GenerationType)}
                        className="hidden"
                      />
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Advanced Options</span>
                  <span className="text-sm text-slate-500">
                    ({showAdvanced ? 'Hide' : 'Show'})
                  </span>
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-6 bg-slate-50 p-6 rounded-xl">
                    {/* Quantity Control */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Number of {generationType === 'both' ? 'items' : generationType} to generate: {quantity}
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500">5</span>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-sm text-slate-500">50</span>
                      </div>
                    </div>

                    {/* Creativity Control */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Question creativity: {getCreativityLabel(creativity)}
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500">Safe</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={creativity}
                          onChange={(e) => setCreativity(Number(e.target.value))}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-sm text-slate-500">Creative</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Higher creativity generates more diverse and challenging questions
                      </p>
                    </div>

                    {/* AI Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Use AI Generation</label>
                        <p className="text-sm text-slate-500">Disable for basic local processing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useAI}
                          onChange={(e) => setUseAI(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!getContentForGeneration().trim() || isGenerating || isProcessingPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
              >
                {isProcessingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing PDF...</span>
                  </>
                ) : isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Study Materials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Study Materials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
