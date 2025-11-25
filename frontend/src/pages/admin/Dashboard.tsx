import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AddPaperModal, PaperData } from '../../components/AddPaperModal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Search, Filter, User, Calendar, Edit, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { toast } from 'sonner';
import imgLogo from 'figma:asset/5e19f141de3eaf2163fbc9110148fd1204d40355.png';

interface Project {
  id: number;
  title: string;
  author: string;
  year: number;
  field: string;
  fileUrl: string;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PaperData | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [filters, setFilters] = useState({
    search: '',
    field: '',
    fromYear: '',
    toYear: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.field && filters.field !== 'all') params.append('field', filters.field);
      
      // Handle year filtering
      if (filters.fromYear) {
        // For simplicity, we'll filter on the frontend after fetching
        // Or you could implement year range filtering in the backend
      }

      const response = await api.get<{ projects: Project[] }>(`/projects?${params.toString()}`);
      
      if (response.data?.projects) {
        let filteredProjects = response.data.projects;
        
        // Apply year filtering on frontend
        if (filters.fromYear || filters.toYear) {
          filteredProjects = filteredProjects.filter((p: Project) => {
            const projectYear = p.year;
            const from = filters.fromYear ? parseInt(filters.fromYear) : 0;
            const to = filters.toYear ? parseInt(filters.toYear) : 9999;
            return projectYear >= from && projectYear <= to;
          });
        }
        
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddPaper = async (paperData: PaperData) => {
    try {
      if (modalMode === 'add') {
        // Create new project
        console.log('Creating project with data:', paperData);
        const response = await api.post<{ project: Project }>('/projects', {
          title: paperData.title,
          author: paperData.author,
          year: parseInt(paperData.year),
          field: paperData.field,
          fileUrl: paperData.file ? 'https://placeholder.com/file.pdf' : 'https://placeholder.com/default.pdf' // Placeholder for now
        });

        console.log('Create project response:', response);

        if (response.data?.project) {
          toast.success('Paper added successfully');
          setIsModalOpen(false);
          fetchProjects(); // Refresh the list
        } else if (response.error) {
          console.error('Create project error:', response);
          toast.error(response.error || 'Failed to create project');
        }
      } else {
        // Update existing project
        if (!editingProject?.id) return;
        
        console.log('Updating project with data:', paperData);
        const response = await api.put<{ project: Project }>(`/projects/${editingProject.id}`, {
          title: paperData.title,
          author: paperData.author,
          year: parseInt(paperData.year),
          field: paperData.field,
          fileUrl: 'https://placeholder.com/file.pdf' // Placeholder for now
        });

        console.log('Update project response:', response);

        if (response.data?.project) {
          toast.success('Paper updated successfully');
          setIsModalOpen(false);
          fetchProjects(); // Refresh the list
        } else if (response.error) {
          console.error('Update project error:', response);
          toast.error(response.error || 'Failed to update project');
        }
      }
    } catch (error) {
      console.error('Error saving paper:', error);
      toast.error('Failed to save paper');
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject({
      id: project.id,
      title: project.title,
      author: project.author,
      year: project.year.toString(),
      field: project.field
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeletePaper = async () => {
    try {
      if (!editingProject?.id) return;

      const response = await api.delete(`/projects/${editingProject.id}`);
      
      if (response.status === 200) {
        toast.success('Paper moved to trash');
        setIsModalOpen(false);
        fetchProjects(); // Refresh the list
      } else if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast.error('Failed to delete paper');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      field: '',
      fromYear: '',
      toYear: ''
    });
  };

  const getBadgeColor = (field: string) => {
    if (field === 'IoT' || field === 'IOT') return 'bg-[#34c759]';
    if (field === 'Database') return 'bg-[#ffcc00]';
    return 'bg-[#34c759]';
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-[#d8d8d8]">
        <div className="mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-[38px] h-[50px] relative overflow-hidden">
                <img 
                  src={imgLogo} 
                  alt="CapSort Logo" 
                  className="absolute h-[123.24%] left-0 top-[-9.86%] w-[263.3%] max-w-none object-cover"
                />
              </div>
              <div>
                <h1 className="font-['Poppins'] text-[20px] text-[#1a1851]">Capsort</h1>
                <p className="font-['Poppins'] text-[12px] text-black">Capstone Archiving and Sorting System</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-12">
              <div className="relative">
                <Link to="/admin/dashboard" className="font-['Poppins'] text-[18px] text-[#1a1851]">
                  Projects
                </Link>
                <div className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-[#1a1851]" />
              </div>
              <Link to="/admin/analytics" className="font-['Poppins'] text-[18px] text-black">
                Analytics
              </Link>
              <Link to="/admin/about" className="font-['Poppins'] text-[18px] text-black">
                About Us
              </Link>
            </div>

            {/* Staff Profile */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/admin/profile')}
            >
              <span className="font-['Poppins'] text-[18px] text-black">{user?.fullName || 'Admin'}</span>
              <div className="w-[40px] h-[40px] rounded-full border border-black bg-white flex items-center justify-center">
                <User size={18} className="text-black" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-8">
        {/* Add Paper Button */}
        <div className="flex justify-end mb-8">
          <Button 
            onClick={handleOpenAddModal}
            className="bg-[#1a1851] hover:bg-[#16163f] text-white rounded-[15px] px-6 py-3 h-auto gap-3"
          >
            <Plus size={20} />
            <span className="font-['Poppins'] text-[20px]">Add Paper</span>
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-[300px] flex-shrink-0">
            <div className="bg-white rounded-[15px] border border-[#1a1851] p-6">
              {/* Filter Header */}
              <div className="flex items-center gap-3 mb-6">
                <Filter size={30} className="text-[#1a1851]" />
                <h2 className="font-['Poppins'] text-[16px] text-black">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="font-['Poppins'] text-[16px] text-black mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Title, Author, or keyword"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-9 h-[35px] rounded-[8px] border-[#d8d8d8] font-['Poppins'] text-[12px] placeholder:text-[#929292]"
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="mb-6">
                <label className="font-['Poppins'] text-[16px] text-black mb-2 block">
                  Fields
                </label>
                <Select value={filters.field} onValueChange={(value) => setFilters({ ...filters, field: value })}>
                  <SelectTrigger className="h-[35px] rounded-[8px] border-[#d8d8d8] font-['Poppins'] text-[12px] text-[#929292]">
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="IoT">IoT</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="mb-6">
                <label className="font-['Poppins'] text-[16px] text-black mb-2 block">
                  Year
                </label>
                <div className="space-y-3">
                  <Select value={filters.fromYear} onValueChange={(value) => setFilters({ ...filters, fromYear: value })}>
                    <SelectTrigger className="h-[35px] rounded-[8px] border-[#d8d8d8] font-['Poppins'] text-[12px] text-[#929292]">
                      <SelectValue placeholder="From Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.toYear} onValueChange={(value) => setFilters({ ...filters, toYear: value })}>
                    <SelectTrigger className="h-[35px] rounded-[8px] border-[#d8d8d8] font-['Poppins'] text-[12px] text-[#929292]">
                      <SelectValue placeholder="To Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reset Filter Button */}
              <Button 
                onClick={handleResetFilter}
                className="w-full h-[35px] bg-[#1a1851] hover:bg-[#16163f] text-white rounded-[8px] font-['Poppins'] text-[16px]"
              >
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Main Content - Capstone Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a1851]" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-['Poppins'] text-[18px] text-[#929292]">
                  No projects found. Add your first paper to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-[15px] border-[0.2px] border-black p-6 relative"
                  >
                    {/* Title and Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="font-['Poppins'] text-[20px] text-black flex-1 pr-4">
                        {project.title}
                      </h3>
                      <Badge 
                        className={`${getBadgeColor(project.field)} text-black rounded-[15px] px-4 py-1 border-0 flex-shrink-0`}
                      >
                        <span className="font-['Poppins'] text-[12px]">{project.field}</span>
                      </Badge>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                      <User size={22} className="text-black" />
                      <span className="font-['Poppins'] text-[15px] text-black">{project.author}</span>
                    </div>

                    {/* Year */}
                    <div className="flex items-center gap-3 mb-8">
                      <Calendar size={22} className="text-black" />
                      <span className="font-['Poppins'] text-[15px] text-black">{project.year}</span>
                    </div>

                    {/* Edit Paper Link */}
                    <button 
                      onClick={() => handleEditClick(project)}
                      className="flex items-center justify-end gap-3 cursor-pointer hover:opacity-70 transition-opacity w-full"
                    >
                      <span className="font-['Poppins'] text-[17px] text-black">Edit paper</span>
                      <Edit size={24} className="text-black" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Paper Modal */}
      <AddPaperModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPaper}
        onDelete={handleDeletePaper}
        initialData={editingProject}
        mode={modalMode}
      />
    </div>
  );
}
