
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Project } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const availableColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(350, 80%, 85%)', // Light Pink
  'hsl(60, 90%, 80%)',  // Light Yellow
  'hsl(200, 80%, 85%)', // Light Blue
  'hsl(140, 70%, 80%)', // Light Green
  'hsl(280, 80%, 90%)', // Light Purple
];

const getNewProjectTemplate = (ownerId: string): Omit<Project, 'id' | 'color'> => ({
  name: '',
  status: 'active',
  hoursPerWeek: 0,
  ownerId: ownerId,
});

export default function ProjectSettings() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'projects'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: initialProjects } = useCollection<Project>(projectsQuery);

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const assignColor = (index: number) => availableColors[index % availableColors.length];

  const handleProjectChange = (
    projectId: string,
    field: keyof Project,
    value: string | number | 'active' | 'archived' | 'completed'
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    );
  };

  const handleNewProjectChange = (
    field: keyof Omit<Project, 'id'>,
    value: string | number | 'active' | 'archived' | 'completed'
  ) => {
    if (!user) return;
    setNewProject((prev) => ({
      ...getNewProjectTemplate(user.uid),
      ...prev,
      [field]: value
    }));
  };

  const commitNewProject = () => {
    if (newProject && newProject.name && newProject.name.trim() !== '' && user && firestore) {
      const newId = `project-${Date.now()}`;
      const projectToCommit: Project = { 
        ...getNewProjectTemplate(user.uid),
        ...newProject,
        id: newId,
        color: newProject.color || assignColor(projects.length),
      } as Project;

      const docRef = doc(firestore, 'projects', newId);
      setDocumentNonBlocking(docRef, projectToCommit, { merge: false });
      
      setProjects(prev => [...prev, projectToCommit]);
      setNewProject(null);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'projects', projectId);
    deleteDocumentNonBlocking(docRef);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };
  
  const handleSaveChanges = () => {
    if (!firestore) return;
    projects.forEach(project => {
      // Only update if it's an existing project
      if (initialProjects?.some(p => p.id === project.id)) {
        const docRef = doc(firestore, 'projects', project.id);
        setDocumentNonBlocking(docRef, project, { merge: true });
      }
    });
  }

  const renderProjectRow = (project: Partial<Project> | null, isNew: boolean) => {
    const currentProject = project || (user ? getNewProjectTemplate(user.uid) : {});

    const changeHandler = isNew
      ? (field: keyof Project, value: any) => handleNewProjectChange(field, value)
      : (field: keyof Project, value: any) => handleProjectChange(currentProject.id!, field, value);

    const onBlurHandler = () => {
      if (isNew && newProject && newProject.name && newProject.name.trim() !== '') {
        commitNewProject();
      }
    };

    return (
      <TableRow key={currentProject.id || 'new'} className="hover:bg-transparent group">
        <TableCell className="p-2 w-16 flex justify-center">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-8 h-8 p-0 border-2"
                style={{
                  backgroundColor: isNew && !project ? 'transparent' : currentProject.color,
                  borderColor: currentProject.color
                }}
                disabled={isNew && !project}
              >
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {availableColors.map((color) => (
                  <Button
                    key={color}
                    variant="ghost"
                    className={cn(
                      "h-6 w-6 rounded-full p-0",
                      currentProject.color === color && "ring-2 ring-ring"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => changeHandler('color', color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell className="p-2 min-w-[200px]">
          <Input
            value={currentProject.name || ''}
            placeholder={isNew ? 'Add a new project...' : ''}
            onChange={(e) => changeHandler('name', e.target.value)}
            onBlur={onBlurHandler}
            onKeyDown={(e) => {
              if (isNew && e.key === 'Enter') {
                commitNewProject();
              }
            }}
            className="w-full bg-transparent border-none focus-visible:ring-1 h-8"
          />
        </TableCell>
        <TableCell className="p-2">
          <Select
            value={currentProject.status || 'active'}
            onValueChange={(value: 'active' | 'archived' | 'completed') =>
              changeHandler('status', value)
            }
            disabled={isNew && !project}
          >
            <SelectTrigger className="bg-transparent border-none focus:ring-1 w-auto h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="p-2">
          <Input
            type="number"
            value={currentProject.hoursPerWeek || 0}
            onChange={(e) =>
              changeHandler('hoursPerWeek', parseInt(e.target.value, 10) || 0)
            }
            className="w-24 bg-transparent border-none focus-visible:ring-1 h-8"
            min="0"
            disabled={isNew && !project}
          />
        </TableCell>
        <TableCell className="p-2 w-12">
          {!isNew && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-20 group-hover:opacity-100 hover:text-destructive"
              onClick={() => handleDeleteProject(currentProject.id!)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-none tracking-tight">Project Settings</h2>
        <p className="text-sm text-muted-foreground">
          Add, edit, and manage your projects.
        </p>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-center">Color</TableHead>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hours per week</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => renderProjectRow(project, false))}
            {renderProjectRow(newProject, true)}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
