import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Edit3, 
  Clock, 
  Layout, 
  LogOut,
  Search
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Interface baseada nos seus modelos de backend
interface Resume {
  id: number;
  data: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    summary?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
  };
  created_at?: string;
  updated_at?: string;
}

export const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Busca a lista de currículos do backend
  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/resumes/');
      console.log('Currículos carregados:', response.data); // Debug
      setResumes(response.data);
    } catch (error) {
      console.error('Erro ao carregar currículos:', error);
      toast.error("Erro ao carregar os seus currículos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja eliminar este currículo?")) {
      try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter(r => r.id !== id));
        toast.success("Currículo eliminado com sucesso!");
      } catch (error) {
        toast.error("Erro ao eliminar o currículo");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  // Função auxiliar para obter o título do currículo
  const getResumeTitle = (resume: Resume): string => {
    return resume.data?.fullName || 'Currículo sem nome';
  };

  // Filtro corrigido
  const filteredResumes = resumes.filter(r => 
    getResumeTitle(r).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Barra de Navegação Superior */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layout className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Resume</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* Cabeçalho da Lista */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Currículos</h1>
            <p className="text-gray-500 mt-1">Gerencie e edite seus projetos de carreira</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-sm"
            >
              <Plus size={20} />
              Novo
            </button>
          </div>
        </div>

        {/* Grade de Currículos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Nenhum currículo encontrado</h3>
            <p className="text-gray-500 mt-2 mb-6">Comece criando o seu primeiro currículo otimizado por IA.</p>
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              Criar agora <Plus size={18} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div 
                key={resume.id} 
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <button 
                      onClick={() => handleDelete(resume.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {getResumeTitle(resume)}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Layout size={14} />
                      <span>Template: Modern</span>
                    </div>
                    {resume.updated_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Editado em: {new Date(resume.updated_at).toLocaleDateString('pt-PT')}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/editor/${resume.id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold py-2.5 rounded-lg transition-colors border border-gray-100"
                  >
                    <Edit3 size={18} />
                    Abrir Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;