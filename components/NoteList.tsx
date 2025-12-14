import React from 'react';
import { Note } from '../types';
import { Search, Plus, Hash, FileText, Music2, Pin } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onAddNote,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="w-full md:w-80 lg:w-[400px] flex flex-col h-full bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Header Area */}
      <div className="p-6 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center text-white">
                <Music2 className="w-5 h-5 mr-2 text-green-500" />
                Library
            </h2>
            <button
                onClick={onAddNote}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 text-sm text-white placeholder-gray-500 rounded-full border border-transparent focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5 group-focus-within:text-white transition-colors" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-6 text-center opacity-60">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Hash className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm font-medium">Your library is empty.</p>
            <p className="text-xs mt-1">Create a note to get started.</p>
          </div>
        ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`
                  group p-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 flex items-start space-x-4 border border-transparent
                  ${activeNoteId === note.id 
                    ? 'bg-white/10 border-white/5 shadow-lg shadow-black/20' 
                    : 'hover:bg-white/5 hover:border-white/5'
                  }
                `}
              >
                {/* Icon Placeholder (Album Art style) */}
                <div className={`
                    w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors relative
                    ${activeNoteId === note.id ? 'bg-gradient-to-br from-green-500 to-emerald-700 text-white' : 'bg-[#1e1e1e] text-gray-600 group-hover:text-gray-300'}
                `}>
                    <FileText className="w-5 h-5" />
                    {note.pinned && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-black">
                            <Pin className="w-2 h-2 fill-current" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-semibold text-sm truncate ${activeNoteId === note.id ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                            {note.title || 'Untitled Track'}
                        </h3>
                        {!note.synced && (
                           <div className="w-2 h-2 rounded-full bg-orange-500" title="Unsynced changes"></div>
                        )}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mb-1">
                        {note.content || 'No content...'}
                    </p>

                    <div className="flex items-center space-x-2">
                        {note.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded-md">
                                {tag}
                            </span>
                        ))}
                         <span className="text-[10px] text-gray-600 ml-auto">
                            {new Date(note.lastUpdated).toLocaleDateString()}
                        </span>
                    </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};