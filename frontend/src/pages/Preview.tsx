import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Loader2,
  Eye,
  Palette
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'modern', name: 'Moderno', color: 'bg-blue-600' },
  { id: 'classic', name: 'Clássico', color: 'bg-gray-800' },
  { id: 'creative', name: 'Criativo', color: 'bg-purple-600' }
];

export const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeTitle, setResumeTitle] = useState('');
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);

  // Carrega o preview do template
  const loadPreview = async (templateName: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/templates/preview/${id}`, {
        params: { template_name: templateName }
      });
      
      setHtmlContent(response.data);
      
      // Extrai o título do currículo do HTML (opcional)
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      const h1 = doc.querySelector('h1');
      if (h1) {
        setResumeTitle(h1.textContent || 'Currículo');
      }
    } catch (error: any) {
      console.error('Erro ao carregar preview:', error);
      toast.error('Erro ao carregar visualização');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview(selectedTemplate);
  }, [id, selectedTemplate]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleExportPDF = async () => {
    try {
      setExporting('pdf');
      const response = await api.get(`/export/pdf/${id}`, {
        responseType: 'blob'
      });

      // Cria um link temporário para download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `curriculo_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    try {
      setExporting('word');
      const response = await api.get(`/export/word/${id}`, {
        responseType: 'blob'
      });

      // Cria um link temporário para download
      const blob = new Blob([response.data], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `curriculo_${id}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Word exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar Word:', error);
      toast.error('Erro ao exportar Word');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(`/editor/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                title="Voltar ao Editor"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Eye className="text-blue-600" size={24} />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Preview</h1>
                  <p className="text-sm text-gray-500">{resumeTitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de Exportar PDF */}
              <button
                onClick={handleExportPDF}
                disabled={exporting !== null}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                {exporting === 'pdf' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                Exportar PDF
              </button>

              {/* Botão de Exportar Word */}
              <button
                onClick={handleExportWord}
                disabled={exporting !== null}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                {exporting === 'word' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                Exportar Word
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Seletor de Templates */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Palette size={20} className="text-blue-600" />
              <h2 className="font-bold">Escolher Template</h2>
            </div>

            <div className="space-y-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${template.color}`}></div>
                    <div>
                      <div className="font-semibold text-gray-900">{template.name}</div>
                      {selectedTemplate === template.id && (
                        <div className="text-xs text-blue-600 mt-1">✓ Selecionado</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/editor/${id}`)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition"
              >
                ← Voltar para editar
              </button>
            </div>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Carregando preview...</p>
              </div>
            ) : (
              <div className="relative">
                {/* Preview Container com escala para simular papel A4 */}
                <div className="preview-container bg-gray-100 p-8">
                  <div className="bg-white shadow-2xl mx-auto" style={{ maxWidth: '850px' }}>
                    <iframe
                      srcDoc={htmlContent}
                      className="w-full border-0"
                      style={{ height: '1200px' }}
                      title="Preview do Currículo"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Eye size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Visualização</h3>
                <p className="text-sm text-gray-600">
                  Esta é uma pré-visualização do seu currículo com o template <strong>{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong>. 
                  Você pode escolher outro template ou exportar nos formatos PDF ou Word.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Preview;