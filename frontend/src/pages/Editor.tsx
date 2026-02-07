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
  GraduationCap 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // Estado unificado do currículo baseado nos seus schemas de backend
  const [resumeData, setResumeData] = useState({
    title: '',
    full_name: '',
    email: '',
    phone: '',
    summary: '',
    experiences: [] as any[],
    educations: [] as any[]
  });

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await api.get(`/resumes/${id}`);
        setResumeData(response.data);
      } catch (error) {
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
      toast.error("Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleAIOptimize = async () => {
    try {
      setOptimizing(true);
      toast.loading("A IA está a otimizar o seu resumo...", { id: 'ai-status' });
      
      const response = await api.post(`/llm/optimize`, {
        content: resumeData.summary,
        context: "summary"
      });

      setResumeData({ ...resumeData, summary: response.data.optimized_content });
      toast.success("Resumo otimizado pela IA!", { id: 'ai-status' });
    } catch (error) {
      toast.error("Erro na otimização", { id: 'ai-status' });
    } finally {
      setOptimizing(false);
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [...resumeData.experiences, { company: '', position: '', description: '', start_date: '', end_date: '' }]
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando editor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Fixo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft size={20} />
            </button>
            <input 
              className="text-xl font-bold bg-transparent border-b border-transparent focus:border-blue-500 outline-none px-2"
              value={resumeData.title}
              onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
            />
          </div>
          <div className="flex gap-3">
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
              value={resumeData.full_name}
              onChange={(e) => setResumeData({...resumeData, full_name: e.target.value})}
            />
            <input 
              placeholder="Email" 
              className="p-2 border rounded-md"
              value={resumeData.email}
              onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
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
              onClick={handleAIOptimize}
              disabled={optimizing || !resumeData.summary}
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
            <button onClick={addExperience} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full">
              <Plus size={24} />
            </button>
          </div>
          
          {resumeData.experiences.map((exp, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg relative group">
              <button 
                onClick={() => {
                  const newExp = [...resumeData.experiences];
                  newExp.splice(index, 1);
                  setResumeData({...resumeData, experiences: newExp});
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  placeholder="Empresa" 
                  className="p-2 border rounded-md"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...resumeData.experiences];
                    newExp[index].company = e.target.value;
                    setResumeData({...resumeData, experiences: newExp});
                  }}
                />
                <input 
                  placeholder="Cargo" 
                  className="p-2 border rounded-md"
                  value={exp.position}
                  onChange={(e) => {
                    const newExp = [...resumeData.experiences];
                    newExp[index].position = e.target.value;
                    setResumeData({...resumeData, experiences: newExp});
                  }}
                />
              </div>
              <textarea 
                placeholder="Descrição das responsabilidades"
                className="w-full p-2 border rounded-md"
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...resumeData.experiences];
                  newExp[index].description = e.target.value;
                  setResumeData({...resumeData, experiences: newExp});
                }}
              />
            </div>
          ))}
        </section>

      </main>
    </div>
  );
};

export default Editor;