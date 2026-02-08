import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap,
  Eye,
  Wand2
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AIOptimizationModal } from '../components/AIOptimizationModal';

interface JobContext {
  title: string;
  level: string;
  objective: string;
  description: string;
}

export const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Estado unificado do currículo baseado nos seus schemas de backend
  const [resumeData, setResumeData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[]
  });

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/resumes/${id}`);
        console.log('Dados recebidos:', response.data);
        
        if (response.data && response.data.data) {
          setResumeData(response.data.data);
        } else {
          setResumeData({
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            summary: '',
            skills: [],
            experience: [],
            education: []
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados do currículo:', error);
        toast.error("Erro ao carregar dados do currículo");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/resumes/${id}`, resumeData);
      toast.success("Alterações guardadas!");
    } catch (error) {
      console.error('Erro ao guardar:', error);
      toast.error("Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleAIOptimize = async (jobContext: JobContext) => {
    try {
      toast.loading("A IA está otimizando seu currículo...", { id: 'ai-optimize' });
      
      const response = await api.post(`/ai/generate/${id}`, {
        job_context: jobContext
      });

      // Atualizar o currículo com os dados otimizados pela IA
      setResumeData(prev => ({
        ...prev,
        summary: response.data.summary || prev.summary,
        experience: response.data.tailoredExperiences || prev.experience,
        skills: response.data.highlightedSkills || prev.skills
      }));

      toast.success("Currículo otimizado com sucesso!", { id: 'ai-optimize' });
      
      // Mostrar sugestões adicionais se houver
      if (response.data.suggestedAdditions && response.data.suggestedAdditions.length > 0) {
        setTimeout(() => {
          toast.success(
            `💡 Sugestões: ${response.data.suggestedAdditions.join(', ')}`,
            { duration: 8000 }
          );
        }, 1000);
      }
    } catch (error: any) {
      console.error('Erro na otimização:', error);
      toast.error(
        error.response?.data?.detail || "Erro ao otimizar com IA",
        { id: 'ai-optimize' }
      );
      throw error; // Re-throw para o modal tratar
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience, 
        { 
          id: Date.now().toString(),
          company: '', 
          role: '', 
          period: '',
          description: ''
        }
      ]
    });
  };

  const removeExperience = (index: number) => {
    const newExp = [...resumeData.experience];
    newExp.splice(index, 1);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          year: ''
        }
      ]
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...resumeData.education];
    newEdu.splice(index, 1);
    setResumeData({ ...resumeData, education: newEdu });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modal de Otimização com IA */}
      <AIOptimizationModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onOptimize={handleAIOptimize}
      />

      {/* Header Fixo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">
              {resumeData.fullName || 'Novo Currículo'}
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
            >
              <Wand2 size={18} />
              Otimizar com IA
            </button>
            <button 
              onClick={() => navigate(`/preview/${id}`)}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <Eye size={18} />
              Visualizar
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <Save size={18} />
              {saving ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 gap-8">
        
        {/* Dados Pessoais */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold border-b pb-2">
            <User size={20} />
            <h2>Informações Pessoais</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Nome Completo" 
              className="p-2 border rounded-md"
              value={resumeData.fullName}
              onChange={(e) => setResumeData({...resumeData, fullName: e.target.value})}
            />
            <input 
              placeholder="Email" 
              type="email"
              className="p-2 border rounded-md"
              value={resumeData.email}
              onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
            />
            <input 
              placeholder="Telefone" 
              className="p-2 border rounded-md"
              value={resumeData.phone}
              onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
            />
            <input 
              placeholder="Localização" 
              className="p-2 border rounded-md"
              value={resumeData.location}
              onChange={(e) => setResumeData({...resumeData, location: e.target.value})}
            />
            <input 
              placeholder="LinkedIn (URL)" 
              className="p-2 border rounded-md md:col-span-2"
              value={resumeData.linkedin}
              onChange={(e) => setResumeData({...resumeData, linkedin: e.target.value})}
            />
          </div>
        </section>

        {/* Resumo Profissional com IA */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Sparkles size={20} />
              <h2>Resumo Profissional</h2>
            </div>
            <button 
              onClick={() => setShowAIModal(true)}
              className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition"
            >
              <Sparkles size={14} />
              Otimizar com IA
            </button>
          </div>
          <textarea 
            rows={4}
            placeholder="Escreva um pouco sobre a sua carreira..."
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={resumeData.summary}
            onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
          />
        </section>

        {/* Experiências */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Briefcase size={20} />
              <h2>Experiência Profissional</h2>
            </div>
            <button onClick={addExperience} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
              <Plus size={24} />
            </button>
          </div>
          
          {resumeData.experience && resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-6 p-4 border rounded-lg relative group">
                <button 
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Empresa" 
                    className="p-2 border rounded-md"
                    value={exp.company || ''}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].company = e.target.value;
                      setResumeData({...resumeData, experience: newExp});
                    }}
                  />
                  <input 
                    placeholder="Cargo" 
                    className="p-2 border rounded-md"
                    value={exp.role || ''}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].role = e.target.value;
                      setResumeData({...resumeData, experience: newExp});
                    }}
                  />
                </div>
                <input 
                  placeholder="Período (ex: Jan 2020 - Dez 2022)" 
                  className="w-full p-2 border rounded-md mb-4"
                  value={exp.period || ''}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].period = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }}
                />
                <textarea 
                  placeholder="Descrição das responsabilidades"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience];
                    newExp[index].description = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhuma experiência adicionada. Clique no + para adicionar.</p>
          )}
        </section>

        {/* Educação */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <GraduationCap size={20} />
              <h2>Formação Acadêmica</h2>
            </div>
            <button onClick={addEducation} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
              <Plus size={24} />
            </button>
          </div>
          
          {resumeData.education && resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-6 p-4 border rounded-lg relative group">
                <button 
                  onClick={() => removeEducation(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Instituição" 
                    className="p-2 border rounded-md"
                    value={edu.institution || ''}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].institution = e.target.value;
                      setResumeData({...resumeData, education: newEdu});
                    }}
                  />
                  <input 
                    placeholder="Curso/Grau" 
                    className="p-2 border rounded-md"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].degree = e.target.value;
                      setResumeData({...resumeData, education: newEdu});
                    }}
                  />
                  <input 
                    placeholder="Ano de conclusão" 
                    className="p-2 border rounded-md col-span-2"
                    value={edu.year || ''}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[index].year = e.target.value;
                      setResumeData({...resumeData, education: newEdu});
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhuma formação adicionada. Clique no + para adicionar.</p>
          )}
        </section>

      </main>
    </div>
  );
};

export default Editor;