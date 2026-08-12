'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FileItem = {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
};

type Project = {
  id: string;
  name: string;
  fileCount: number;
};

export default function StoragePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
      loadProjects();
    }
  }, [router]);

  const loadProjects = async () => {
    // Mock projects
    setProjects([
      { id: '1', name: 'Vacation 2024', fileCount: 245 },
      { id: '2', name: 'Business Photos', fileCount: 89 },
      { id: '3', name: 'Personal Archive', fileCount: 512 },
    ]);
    setCurrentProject('1');
    loadFiles('1');
  };

  const loadFiles = async (_projectId: string) => {
    // Mock files
    const mockFiles: FileItem[] = [
      {
        id: '1',
        filename: 'beach-sunset.jpg',
        size: 2500000,
        type: 'image/jpeg',
        url: 'https://via.placeholder.com/300x200?text=Sunset',
        createdAt: '2024-08-10',
      },
      {
        id: '2',
        filename: 'mountain-view.jpg',
        size: 3200000,
        type: 'image/jpeg',
        url: 'https://via.placeholder.com/300x200?text=Mountain',
        createdAt: '2024-08-09',
      },
      {
        id: '3',
        filename: 'city-lights.png',
        size: 4100000,
        type: 'image/png',
        url: 'https://via.placeholder.com/300x200?text=City',
        createdAt: '2024-08-08',
      },
      {
        id: '4',
        filename: 'forest-trail.jpg',
        size: 2800000,
        type: 'image/jpeg',
        url: 'https://via.placeholder.com/300x200?text=Forest',
        createdAt: '2024-08-07',
      },
    ];
    setFiles(mockFiles);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getSortedFiles = () => {
    let filtered = files;

    if (filterType !== 'all') {
      filtered = files.filter((f) => {
        if (filterType === 'images') return f.type.startsWith('image/');
        if (filterType === 'documents') return !f.type.startsWith('image/');
        return true;
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.filename.localeCompare(b.filename);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'date')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  };

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const sortedFiles = getSortedFiles();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">CloudImage</h1>
          <p className="text-xs text-gray-500 mt-1">Storage Manager</p>
        </div>

        {/* Projects */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Projects
          </h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setCurrentProject(project.id);
                  loadFiles(project.id);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  currentProject === project.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{project.name}</span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {project.fileCount}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 px-4 py-2 rounded-lg font-medium transition">
            + New Project
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            href="/chat"
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            AI Assistant
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-center text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {projects.find((p) => p.id === currentProject)?.name || 'Project'}
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + Upload Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Filters & Sort */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="date">Date</option>
              </select>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">All Files</option>
                <option value="images">Images Only</option>
                <option value="documents">Documents Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery View */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedFiles.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-6xl mb-4 block">📁</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Files</h3>
                <p className="text-gray-600">Upload files to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition group cursor-pointer"
                >
                  {/* Image Preview */}
                  <div className="relative bg-gray-100 h-40 overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📄
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">
                      {file.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatBytes(file.size)}
                    </p>
                    <p className="text-xs text-gray-400">{file.createdAt}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button className="flex-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded font-medium">
                      View
                    </button>
                    <button className="flex-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <strong>{sortedFiles.length}</strong> files
            </div>
            <div>
              <strong>
                {formatBytes(sortedFiles.reduce((sum, f) => sum + f.size, 0))}
              </strong>{' '}
              total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
