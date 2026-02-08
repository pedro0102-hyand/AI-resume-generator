import { useState } from 'react';
import { X, Sparkles, Wand2, Loader2 } from 'lucide-react';

interface JobContext {
  title: string;
  level: string;
  objective: string;
  description: string;
}

interface AIOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptimize: (jobContext: JobContext) => Promise<void>;
}

export const AIOptimizationModal = ({ isOpen, onClose, onOptimize }: AIOptimizationModalProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [jobContext, setJobContext] = useState<JobContext>({
    title: '',
    level: '',
    objective: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);
    try {
      await onOptimize(jobContext);
      onClose();
      // Limpar formulário após sucesso
      setJobContext({
        title: '',
        level: '',
        objective: '',
        description: ''
      });
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleClose = () => {
    if (!isOptimizing) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Otimização com IA</h2>
                <p className="text-purple-100 text-sm mt-1">
                  Personalize seu currículo para a vaga desejada
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isOptimizing}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título da Vaga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título da Vaga *
            </label>
            <input
              type="text"
              required
              value={jobContext.title}
              onChange={(e) => setJobContext({ ...jobContext, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ex: Desenvolvedor Full Stack Senior"
            />
          </div>

          {/* Nível da Vaga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nível da Vaga *
            </label>
            <select
              required
              value={jobContext.level}
              onChange={(e) => setJobContext({ ...jobContext, level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="">Selecione o nível</option>
              <option value="Estágio">Estágio</option>
              <option value="Júnior">Júnior</option>
              <option value="Pleno">Pleno</option>
              <option value="Sênior">Sênior</option>
              <option value="Especialista">Especialista</option>
              <option value="Gerente">Gerente</option>
              <option value="Diretor">Diretor</option>
            </select>
          </div>

          {/* Objetivo da Candidatura */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Objetivo da Candidatura
            </label>
            <input
              type="text"
              value={jobContext.objective}
              onChange={(e) => setJobContext({ ...jobContext, objective: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Ex: Transição de carreira para tech, Crescimento profissional..."
            />
            <p className="text-xs text-gray-500 mt-1">Opcional - ajuda a IA entender seu contexto</p>
          </div>

          {/* Descrição da Vaga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição da Vaga *
            </label>
            <textarea
              required
              rows={6}
              value={jobContext.description}
              onChange={(e) => setJobContext({ ...jobContext, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Cole aqui a descrição completa da vaga, incluindo requisitos, responsabilidades e qualificações desejadas..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Quanto mais detalhes, melhor será a otimização
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Wand2 className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Como funciona:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• A IA analisará sua experiência e a vaga</li>
                  <li>• Seu resumo será otimizado para destacar habilidades relevantes</li>
                  <li>• Experiências serão reformuladas com foco na vaga</li>
                  <li>• Skills mais importantes serão destacadas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isOptimizing}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isOptimizing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Otimizando...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Otimizar com IA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};