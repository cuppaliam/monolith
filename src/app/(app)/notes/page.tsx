'use client';

import ObsidianEditor from '@/components/notes/obsidian-editor';
import { PenTool } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Notes</h1>
          <p className="text-muted-foreground">
            A live markdown editor for your thoughts and ideas.
          </p>
        </div>
      </header>
      <div className="flex-grow overflow-hidden">
        <ObsidianEditor />
      </div>
      <div className="absolute bottom-6 right-8 flex gap-2">
        <div className="bg-card hover:bg-muted text-primary p-3 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-105">
          <PenTool className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
