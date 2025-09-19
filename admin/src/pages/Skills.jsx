import { useState } from 'react'
import { Plus, Edit, Trash2, Code, Palette, Server, Database, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Skills() {
  const [skills, setSkills] = useState([
    // Frontend
    { id: 1, name: 'React', level: 90, category: 'Frontend', icon: 'Code' },
    { id: 2, name: 'Vue.js', level: 85, category: 'Frontend', icon: 'Code' },
    { id: 3, name: 'HTML5', level: 95, category: 'Frontend', icon: 'Code' },
    { id: 4, name: 'CSS3', level: 90, category: 'Frontend', icon: 'Palette' },
    { id: 5, name: 'JavaScript', level: 92, category: 'Frontend', icon: 'Code' },
    { id: 6, name: 'TypeScript', level: 80, category: 'Frontend', icon: 'Code' },
    
    // Backend
    { id: 7, name: 'Node.js', level: 88, category: 'Backend', icon: 'Server' },
    { id: 8, name: 'Express', level: 85, category: 'Backend', icon: 'Server' },
    { id: 9, name: 'Python', level: 75, category: 'Backend', icon: 'Server' },
    { id: 10, name: 'PHP', level: 70, category: 'Backend', icon: 'Server' },
    
    // Database
    { id: 11, name: 'MongoDB', level: 82, category: 'Database', icon: 'Database' },
    { id: 12, name: 'MySQL', level: 85, category: 'Database', icon: 'Database' },
    { id: 13, name: 'PostgreSQL', level: 78, category: 'Database', icon: 'Database' },
    
    // Tools
    { id: 14, name: 'Git', level: 90, category: 'Tools', icon: 'Wrench' },
    { id: 15, name: 'Docker', level: 75, category: 'Tools', icon: 'Wrench' },
    { id: 16, name: 'Webpack', level: 80, category: 'Tools', icon: 'Wrench' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: 'Frontend',
    icon: 'Code'
  })

  const categories = [
    { name: 'Frontend', icon: Code, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Backend', icon: Server, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Database', icon: Database, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Tools', icon: Wrench, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ]

  const iconOptions = [
    { name: 'Code', component: Code },
    { name: 'Palette', component: Palette },
    { name: 'Server', component: Server },
    { name: 'Database', component: Database },
    { name: 'Wrench', component: Wrench }
  ]

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(option => option.name === iconName)
    return iconOption ? iconOption.component : Code
  }

  const getCategoryInfo = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || categories[0]
  }

  const getLevelColor = (level) => {
    if (level >= 90) return 'progress-success'
    if (level >= 70) return 'progress-warning'
    if (level >= 50) return 'progress-info'
    return 'progress-error'
  }

  const getLevelText = (level) => {
    if (level >= 90) return 'Expert'
    if (level >= 70) return 'Avancé'
    if (level >= 50) return 'Intermédiaire'
    return 'Débutant'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingSkill) {
      setSkills(skills.map(s => 
        s.id === editingSkill.id 
          ? { ...formData, id: editingSkill.id }
          : s
      ))
      toast.success('Compétence modifiée avec succès')
    } else {
      const newSkill = {
        ...formData,
        id: Date.now()
      }
      setSkills([...skills, newSkill])
      toast.success('Compétence ajoutée avec succès')
    }

    setShowModal(false)
    setEditingSkill(null)
    setFormData({
      name: '',
      level: 50,
      category: 'Frontend',
      icon: 'Code'
    })
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData(skill)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      setSkills(skills.filter(s => s.id !== id))
      toast.success('Compétence supprimée avec succès')
    }
  }

  const groupedSkills = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.name)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Compétences</h1>
          <p className="text-base-content/70 mt-1">
            Gérez vos compétences techniques et leur niveau
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Nouvelle compétence
        </button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {groupedSkills.map((category) => {
          const CategoryIcon = category.icon
          return (
            <div key={category.name} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                    <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-sm text-base-content/70">
                      {category.skills.length} compétence{category.skills.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {category.skills.length === 0 ? (
                  <div className="text-center py-8 text-base-content/50">
                    Aucune compétence dans cette catégorie
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.skills.map((skill) => {
                      const SkillIcon = getIconComponent(skill.icon)
                      return (
                        <div key={skill.id} className="p-4 border border-base-300 rounded-lg hover:bg-base-50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <SkillIcon className="w-5 h-5 text-base-content/70" />
                              <span className="font-medium">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleEdit(skill)}
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button 
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => handleDelete(skill.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-base-content/70">{getLevelText(skill.level)}</span>
                              <span className="font-medium">{skill.level}%</span>
                            </div>
                            <progress 
                              className={`progress w-full ${getLevelColor(skill.level)}`} 
                              value={skill.level} 
                              max="100"
                            ></progress>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Nom *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Catégorie</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Icône</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.name} value={icon.name}>
                      {icon.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Niveau: {formData.level}% ({getLevelText(formData.level)})</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="range range-primary"
                  step="5"
                />
                <div className="w-full flex justify-between text-xs text-base-content/50 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSkill(null)
                    setFormData({
                      name: '',
                      level: 50,
                      category: 'Frontend',
                      icon: 'Code'
                    })
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSkill ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
