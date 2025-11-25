'use client';

import { useState } from 'react';
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
import { projects as initialProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { Trash2, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const availableColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const getNewProjectTemplate = (): Project => ({
  id: `new-${Date.now()}`,
  name: '',
  color: availableColors[0],
  status: 'active',
  hoursPerWeek: 0,
});

export default function ProjectSettings() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newProject, setNewProject] = useState<Project | null>(null);

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
    field: keyof Project,
    value: string | number | 'active' | 'archived' | 'completed'
  ) => {
    if (!newProject) {
      setNewProject({ ...getNewProjectTemplate(), color: assignColor(projects.length), [field]: value });
    } else {
      setNewProject((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const commitNewProject = () => {
    if (newProject && newProject.name.trim() !== '') {
      const projectToCommit = {
        ...newProject,
        id: `project-${Date.now()}`,
        color: newProject.color || assignColor(projects.length),
      };
      setProjects([...projects, projectToCommit]);
      setNewProject(null);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const renderProjectRow = (project: Project | null, isNew: boolean) => {
    const currentProject = project || getNewProjectTemplate();

    const changeHandler = isNew
      ? (field: keyof Project, value: any) => handleNewProjectChange(field, value)
      : (field: keyof Project, value: any) => handleProjectChange(currentProject.id, field, value);

    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isNew && newProject && newProject.name.trim() !== '') {
        commitNewProject();
      }
    };

    return (
      <TableRow key={currentProject.id} className="hover:bg-transparent group">
        <TableCell className="p-2 w-16">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-10 h-10 p-0 border-2"
                style={{
                  backgroundColor: isNew && !project ? 'transparent' : currentProject.color,
                  borderColor: currentProject.color
                }}
                disabled={isNew && !project}
              >
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex gap-1">
                {availableColors.map((color) => (
                  <Button
                    key={color}
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 rounded-full p-0",
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
        <TableCell className="p-2">
          <Input
            value={currentProject.name}
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
            value={currentProject.status}
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
            value={currentProject.hoursPerWeek}
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
              onClick={() => handleDeleteProject(currentProject.id)}
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Color</TableHead>
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
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
