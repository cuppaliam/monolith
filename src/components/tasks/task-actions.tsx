'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Project, Task, TaskPriority, TaskStatus } from '@/lib/types';
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { DatePicker } from '../ui/date-picker';

export function TaskActions() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'projects'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: projects } = useCollection<Project>(projectsQuery);

  const columnsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'columns'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: columns } = useCollection(columnsQuery);


  const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore) return;

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const projectId = formData.get('project') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    
    if (!title || !projectId) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      projectId,
      status,
      priority,
      dueDate: dueDate ? formatISO(dueDate) : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ownerId: user.uid,
    };
    
    const tasksCollection = collection(firestore, 'tasks');
    addDocumentNonBlocking(tasksCollection, newTask);
    
    setIsOpen(false);
    setDueDate(new Date()); // Reset due date
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateTask}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" placeholder="Build new feature" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <Select name="project">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {(projects ?? []).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue="todo">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(columns ?? []).sort((a,b) => a.order - b.order).map(col => (
                     <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
               <DatePicker date={dueDate} setDate={setDueDate} className="col-span-3" />
            </div>
          </div>
          <Button type="submit">Save Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
