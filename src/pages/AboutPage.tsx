import React from 'react';
import { BookOpen, Brain, Zap, Target, Users, Award, ExternalLink } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          About Smart Study Flashcard & Quiz Maker
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Revolutionizing how students create and interact with study materials through AI-powered content generation.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 mb-12">
        <div className="flex items-center mb-6">
          <Target className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
        </div>
        <p className="text-lg text-slate-700 leading-relaxed">
          We believe that effective studying shouldn't be time-consuming to set up. Our mission is to empower 
          students and learners worldwide by instantly transforming any text into interactive, engaging study 
          materials. By leveraging modern web technologies and intelligent content processing, we make quality 
          study tools accessible to everyone, anywhere, without the need for complex setups or subscriptions.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          <Brain className="h-8 w-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Paste Your Content</h3>
            <p className="text-slate-600">
              Simply copy and paste your notes, textbook excerpts, or any study material into our intelligent text processor.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 text-center">
            <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">AI Processing</h3>
            <p className="text-slate-600">
              Our smart algorithms analyze your content and automatically generate relevant flashcards and quiz questions.
            </p>
          </div>

          <div className="bg-teal-50 rounded-xl p-6 text-center">
            <div className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Study & Master</h3>
            <p className="text-slate-600">
              Use our interactive study modes to reinforce learning and track your progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          <Zap className="h-8 w-8 text-yellow-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Intelligent Content Analysis',
              description: 'Our AI identifies key concepts, terms, and relationships in your study materials.',
              icon: Brain,
              color: 'text-purple-600',
              bg: 'bg-purple-50'
            },
            {
              title: 'Interactive Flashcards',
              description: 'Beautifully designed cards with smooth animations and progress tracking.',
              icon: BookOpen,
              color: 'text-blue-600',
              bg: 'bg-blue-50'
            },
            {
              title: 'Multiple Quiz Formats',
              description: 'Generate multiple choice, true/false, and fill-in-the-blank questions.',
              icon: Target,
              color: 'text-green-600',
              bg: 'bg-green-50'
            },
            {
              title: 'Offline Functionality',
              description: 'Study anywhere with complete offline support using local browser storage.',
              icon: Zap,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50'
            },
            {
              title: 'Export Options',
              description: 'Download your study materials as PDFs for offline studying or sharing.',
              icon: ExternalLink,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50'
            },
            {
              title: 'Progress Tracking',
              description: 'Monitor your learning progress and identify areas that need more attention.',
              icon: Award,
              color: 'text-orange-600',
              bg: 'bg-orange-50'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`${feature.bg} rounded-xl p-6`}>
                <div className="flex items-center mb-4">
                  <Icon className={`h-6 w-6 ${feature.color} mr-3`} />
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                </div>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Study Tips */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <Award className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Tips for Effective Studying</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Using Flashcards</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Review cards daily, even if just for 10-15 minutes
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Focus extra time on cards marked for review
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Study in short, frequent sessions rather than long cramming sessions
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Try to explain concepts in your own words
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Taking Quizzes</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Take practice quizzes regularly to test your knowledge
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Review incorrect answers and understand why they're wrong
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Retake quizzes until you consistently score well
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Use the detailed feedback to identify knowledge gaps
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology & Credits */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 mb-12">
        <div className="flex items-center mb-6">
          <Users className="h-8 w-8 text-slate-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Technology & Credits</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Built With</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• React & TypeScript for robust frontend development</li>
              <li>• Tailwind CSS for modern, responsive design</li>
              <li>• Local Storage API for offline functionality</li>
              <li>• jsPDF for document generation</li>
              <li>• Advanced text processing algorithms</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Privacy & Data</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• No user accounts or registration required</li>
              <li>• All data stored locally in your browser</li>
              <li>• No external servers or data collection</li>
              <li>• Complete privacy and data ownership</li>
              <li>• Works entirely offline after initial load</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>Code of Conduct</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>Open Source</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        
        <p className="text-slate-500 mt-8">
          Built with ❤️ for learners everywhere. Making education more accessible, one flashcard at a time.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;