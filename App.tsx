import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import { StorageService } from './services/storage';
import { AuthScreen } from './components/AuthScreen';
import { Layout } from './components/Layout';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { IntroCard } from './components/IntroCard';
import { CinematicIntro } from './components/CinematicIntro';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { user, login, logout, loading: authLoading } = useAuth();
  const { notes, addNote, updateNote, deleteNote, togglePin, syncStatus, triggerSync } = useNotes();
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntroCard, setShowIntroCard] = useState(false);
  const [showCinematic, setShowCinematic] = useState(true); // Default to true to show intro on load
  
  // -- Check Intro State --
  useEffect(() => {
    if (user && !StorageService.hasSeenIntro()) {
        setShowIntroCard(true);
    }
  }, [user]);

  const handleDismissIntro = () => {
    StorageService.setIntroSeen();
    setShowIntroCard(false);
  };

  // -- Computed State --
  
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    const lower = searchTerm.toLowerCase();
    return notes.filter(n => 
        n.title.toLowerCase().includes(lower) || 
        n.content.toLowerCase().includes(lower) ||
        n.tags.some(t => t.toLowerCase().includes(lower))
    );
  }, [notes, searchTerm]);

  const activeNote = useMemo(() => 
    notes.find(n => n.id === activeNoteId) || null
  , [notes, activeNoteId]);

  // -- Handlers --

  const handleAddNote = () => {
    addNote('', '');
  };

  const handleLogout = () => {
    logout();
    setActiveNoteId(null);
  };

  // -- Render --

  // 1. Show Cinematic Intro first, regardless of auth state
  if (showCinematic) {
    return <CinematicIntro onComplete={() => setShowCinematic(false)} />;
  }

  // 2. Loading State
  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  // 3. Auth Screen
  if (!user) {
    return <AuthScreen onLogin={login} loading={authLoading} />;
  }

  // 4. Main App
  return (
    <>
        {showIntroCard && <IntroCard onDismiss={handleDismissIntro} />}
        
        <Layout 
            userEmail={user.email} 
            onLogout={handleLogout} 
            syncStatus={syncStatus}
            triggerSync={triggerSync}
        >
          {/* Note List (Playlist Sidebar) */}
          <div className={`
              ${activeNoteId ? 'hidden md:flex' : 'flex'} 
              h-full w-full md:w-auto
          `}>
            <NoteList 
              notes={filteredNotes} 
              activeNoteId={activeNoteId}
              onSelectNote={setActiveNoteId}
              onAddNote={handleAddNote}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Editor Area (Main Stage) */}
          <div className={`
              ${!activeNoteId ? 'hidden md:flex' : 'flex'} 
              flex-1 h-full relative
          `}>
            {activeNote ? (
              <>
                  <button 
                      onClick={() => setActiveNoteId(null)}
                      className="md:hidden absolute top-4 left-4 z-50 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
                  >
                      ← Back
                  </button>
                  <NoteEditor 
                      note={activeNote}
                      onUpdate={updateNote}
                      onDelete={(id) => {
                          deleteNote(id);
                          setActiveNoteId(null);
                      }}
                      onTogglePin={togglePin}
                  />
              </>
            ) : (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 text-gray-500">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Ready to create?</h3>
                <p className="text-sm">Select a note from your library or create a new one.</p>
              </div>
            )}
          </div>
        </Layout>
    </>
  );
};

export default App;