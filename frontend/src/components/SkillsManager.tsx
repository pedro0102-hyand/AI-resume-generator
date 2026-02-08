import { useState } from 'react';
import { Plus, Trash2, Tag, Sparkles } from 'lucide-react';

interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onAIOptimize?: () => void;
}

// Skills sugeridas por categoria
const SUGGESTED_SKILLS = {
  'Desenvolvimento': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 
    'Angular', 'Vue.js', 'SQL', 'MongoDB', 'Git', 'Docker'
  ],
  'Design': [
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design',
    'Prototipagem', 'Design Thinking', 'Sketch'
  ],
  'Marketing': [
    'SEO', 'Google Analytics', 'Marketing Digital', 'Redes Sociais',
    'Content Marketing', 'Email Marketing', 'Copywriting', 'Google Ads'
  ],
  'Gestão': [
    'Liderança', 'Gestão de Projetos', 'Scrum', 'Agile', 'JIRA',
    'Comunicação', 'Resolução de Problemas', 'Tomada de Decisão'
  ],
  'Dados': [
    'Excel', 'Power BI', 'Tableau', 'Python', 'R', 'SQL',
    'Machine Learning', 'Data Analysis', 'Estatística'
  ]
};

export const SkillsManager = ({ skills, onSkillsChange, onAIOptimize }: SkillsManagerProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = (skill: string = newSkill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onSkillsChange([...skills, trimmedSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onSkillsChange(newSkills);
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    onSkillsChange(newSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-2">
          <Tag size={20} />
          <h2>Habilidades</h2>
          {skills.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
              {skills.length}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {onAIOptimize && (
            <button 
              onClick={onAIOptimize}
              className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition"
            >
              <Sparkles size={14} />
              Otimizar com IA
            </button>
          )}
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-xs flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition"
          >
            <Tag size={14} />
            {showSuggestions ? 'Ocultar' : 'Ver'} Sugestões
          </button>
        </div>
      </div>

      {/* Input para adicionar nova skill */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma habilidade e pressione Enter..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={() => addSkill()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Dica: Pressione Enter para adicionar rapidamente
        </p>
      </div>

      {/* Sugestões de Skills */}
      {showSuggestions && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-green-600" />
            Sugestões de Habilidades
          </h3>
          {Object.entries(SUGGESTED_SKILLS).map(([category, categorySkills]) => (
            <div key={category} className="mb-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSuggestedSkill(skill)}
                    disabled={skills.includes(skill)}
                    className={`text-xs px-3 py-1.5 rounded-full transition ${
                      skills.includes(skill)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-green-300 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {skills.includes(skill) ? '✓ ' : '+ '}
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de Skills Adicionadas */}
      {skills.length > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2 items-center group">
                <div className="flex-1 relative">
                  <input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Nome da habilidade"
                  />
                  <button
                    onClick={() => removeSkill(index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition opacity-0 group-hover:opacity-100"
                    title="Remover habilidade"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dica de IA */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Dica:</strong> Liste habilidades técnicas e comportamentais relevantes.
              {onAIOptimize && ' A IA pode otimizar esta lista baseada na vaga desejada.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Tag className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-500 mb-2 font-medium">Nenhuma habilidade adicionada</p>
          <p className="text-gray-400 text-sm mb-4">
            Adicione suas habilidades técnicas e comportamentais
          </p>
          <button
            onClick={() => setShowSuggestions(true)}
            className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition font-medium"
          >
            <Sparkles size={18} />
            Ver Sugestões
          </button>
        </div>
      )}
    </section>
  );
};