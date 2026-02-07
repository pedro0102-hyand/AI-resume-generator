import { useNavigate } from 'react-router-dom';
import { Layout, Check, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design limpo e profissional com foco em legibilidade e seções bem definidas.',
    color: 'bg-blue-600',
    previewColor: 'bg-slate-100'
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Layout tradicional e elegante, ideal para áreas mais conservadoras ou acadêmicas.',
    color: 'bg-gray-800',
    previewColor: 'bg-stone-50'
  },
  {
    id: 'creative',
    name: 'Criativo',
    description: 'Destaque-se com cores e um layout dinâmico para áreas de design e tecnologia.',
    color: 'bg-purple-600',
    previewColor: 'bg-purple-50'
  }
];

export const Templates = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = async (templateId: string) => {
    try {
      // Cria um novo currículo com o template selecionado e título padrão
      const response = await api.post('/resumes/', {
        title: `Meu Currículo - ${templateId.charAt(0).toUpperCase() + templateId.slice(1)}`,
        template_name: templateId
      });
      
      const newResume = response.data;
      toast.success(`${templateId} selecionado!`);
      // Redireciona para o editor com o ID do currículo recém-criado
      navigate(`/editor/${newResume.id}`);
    } catch (error) {
      toast.error("Erro ao iniciar novo currículo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Escolha um Template</h1>
          <p className="text-lg text-gray-600">Selecione a base visual para o seu novo currículo otimizado por IA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEMPLATES.map((template) => (
            <div 
              key={template.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Preview Simulado */}
              <div className={`h-48 ${template.previewColor} p-6 flex flex-col gap-2`}>
                <div className={`${template.color} w-3/4 h-3 rounded`}></div>
                <div className="bg-gray-300 w-1/2 h-2 rounded"></div>
                <div className="mt-4 space-y-2">
                  <div className="bg-gray-200 w-full h-2 rounded"></div>
                  <div className="bg-gray-200 w-full h-2 rounded"></div>
                  <div className="bg-gray-200 w-2/3 h-2 rounded"></div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-500 text-sm mb-6 h-12">
                  {template.description}
                </p>
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors ${template.color} text-white hover:opacity-90`}
                >
                  <Check size={20} />
                  Usar este modelo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};