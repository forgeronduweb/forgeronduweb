import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Site E-commerce React',
      description: 'Plateforme de vente en ligne moderne avec panier et paiement',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'Terminé',
      image: '/api/placeholder/300/200',
      url: 'https://example.com',
      github: 'https://github.com/user/project',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Dashboard Analytics',
      description: 'Interface d\'administration avec graphiques et statistiques',
      technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Chart.js'],
      status: 'En cours',
      image: '/api/placeholder/300/200',
      url: 'https://example2.com',
      github: 'https://github.com/user/project2',
      createdAt: '2024-02-10'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    status: 'En cours',
    url: '',
    github: '',
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      createdAt: editingProject ? editingProject.createdAt : new Date().toISOString().split('T')[0]
    }

    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...projectData, id: editingProject.id }
          : p
      ))
      toast.success('Projet modifié avec succès')
    } else {
      const newProject = {
        ...projectData,
        id: Date.now()
      }
      setProjects([...projects, newProject])
      toast.success('Projet ajouté avec succès')
    }

    setShowModal(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      technologies: '',
      status: 'En cours',
      url: '',
      github: '',
      image: ''
    })
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      ...project,
      technologies: project.technologies.join(', ')
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Projet supprimé avec succès')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé':
        return 'badge-success'
      case 'En cours':
        return 'badge-warning'
      case 'En pause':
        return 'badge-error'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Projets</h1>
          <p className="text-base-content/70 mt-1">
            Gérez vos projets et réalisations
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Nouveau projet
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
            <figure className="px-4 pt-4">
              <img 
                src={project.image || '/api/placeholder/300/200'} 
                alt={project.title}
                className="rounded-lg w-full h-48 object-cover bg-base-200"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h2 className="card-title text-lg">{project.title}</h2>
                <div className={`badge ${getStatusColor(project.status)} badge-sm`}>
                  {project.status}
                </div>
              </div>
              
              <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="badge badge-ghost badge-sm">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              <div className="card-actions justify-between items-center">
                <div className="flex gap-2">
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      title="Voir le site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      title="Voir le code"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Titre *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Statut</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En pause">En pause</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Technologies (séparées par des virgules)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">URL du site</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">GitHub</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">URL de l'image</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProject(null)
                    setFormData({
                      title: '',
                      description: '',
                      technologies: '',
                      status: 'En cours',
                      url: '',
                      github: '',
                      image: ''
                    })
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
