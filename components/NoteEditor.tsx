import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { Trash2, Tag, Clock, Pin, Bold, Italic, List, Type, Pencil } from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onDelete, onTogglePin }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [isTyping, setIsTyping] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
  }, [note.id]); 

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const hasChanges = 
        title !== note.title || 
        content !== note.content || 
        JSON.stringify(currentTags) !== JSON.stringify(note.tags);

      if (hasChanges) {
        onUpdate(note.id, { 
          title, 
          content,
          tags: currentTags
        });
        setIsTyping(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [title, content, tags, note, onUpdate]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
      setter(value);
      setIsTyping(true);
  };

  const handleFocusTitle = () => {
    titleInputRef.current?.focus();
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
      if (!contentRef.current) return;
      
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const text = contentRef.current.value;
      
      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);
      
      const newContent = `${before}${prefix}${selection}${suffix}${after}`;
      setContent(newContent);
      setIsTyping(true);
      
      // Restore focus and cursor
      setTimeout(() => {
          contentRef.current?.focus();
          const newCursorPos = start + prefix.length;
          contentRef.current?.setSelectionRange(newCursorPos, newCursorPos + selection.length);
      }, 0);
  };

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="flex-1 flex flex-col h-full bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
      
      {/* Editor Header */}
      <div className="flex items-center justify-between px-8 py-6 z-10 border-b border-white/5 bg-white/5">
        <div className="flex items-center space-x-3">
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                {isTyping ? <span className="text-green-400">Saving...</span> : 'Saved'}
             </div>
             {note.pinned && (
                 <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 flex items-center">
                    <Pin className="w-3 h-3 mr-1.5 fill-current" />
                    Pinned
                 </div>
             )}
        </div>
        
        <div className="flex items-center space-x-2">
            {onTogglePin && (
                <button
                onClick={() => onTogglePin(note.id)}
                className={`p-2 rounded-full transition-colors ${note.pinned ? 'text-blue-400 bg-blue-400/10' : 'text-gray-500 hover:text-blue-400 hover:bg-white/5'}`}
                title={note.pinned ? "Unpin Note" : "Pin Note"}
                >
                <Pin className={`w-5 h-5 ${note.pinned ? 'fill-current' : ''}`} />
                </button>
            )}
            <button
            onClick={() => {
                if (window.confirm("Are you sure you want to delete this note?")) {
                onDelete(note.id);
                }
            }}
            className="group p-2 rounded-full hover:bg-red-500/10 transition-colors"
            title="Delete Note"
            >
            <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-8 py-2 border-b border-white/5 flex items-center space-x-2 overflow-x-auto">
          <button onClick={() => insertMarkdown('**', '**')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => insertMarkdown('*', '*')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Italic">
              <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => insertMarkdown('# ', '')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Heading">
              <Type className="w-4 h-4" />
          </button>
          <button onClick={() => insertMarkdown('- ', '')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="List">
              <List className="w-4 h-4" />
          </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 z-10 custom-scrollbar mt-4">
        {/* Title Section with Edit Button */}
        <div className="relative group mb-6">
            <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => handleChange(setTitle, e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-5xl font-bold text-white placeholder-gray-700 bg-transparent border-none outline-none tracking-tight pr-12"
            />
            <button 
                onClick={handleFocusTitle}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-green-500"
                title="Edit Title"
            >
                <Pencil className="w-5 h-5" />
            </button>
        </div>
        
        {/* Tag Input */}
        <div className="flex items-center mb-8">
            <div className="flex items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 focus-within:border-green-500/50 transition-colors">
                <Tag className="w-4 h-4 text-green-500 mr-2" />
                <input 
                    type="text"
                    value={tags}
                    onChange={(e) => handleChange(setTags, e.target.value)}
                    placeholder="Add tags..."
                    className="bg-transparent border-none outline-none text-sm w-64 text-gray-300 placeholder-gray-600"
                />
            </div>
        </div>

        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => handleChange(setContent, e.target.value)}
          placeholder="Start writing..."
          className="w-full h-[calc(100%-150px)] resize-none text-lg text-gray-300 leading-relaxed placeholder-gray-700 border-none outline-none bg-transparent"
        />
      </div>

      {/* Status Footer */}
      <div className="px-8 py-3 border-t border-white/5 bg-black/20 text-xs text-gray-500 flex justify-between items-center">
          <div>
              {wordCount} words • {readTime} min read
          </div>
          <div className="flex items-center space-x-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
               <span>Markdown Supported</span>
          </div>
      </div>
    </div>
  );
};