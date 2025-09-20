import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Mail, 
  MailOpen, 
  Trash2, 
  Calendar,
  User,
  Phone,
  MessageSquare,
  Send,
  X,
  Reply
} from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [replyingToMessage, setReplyingToMessage] = useState(null)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [showReplyInModal, setShowReplyInModal] = useState(false)
  const [sentReply, setSentReply] = useState('')

  // Données simulées de messages de contact
  const initialMessages = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      subject: "Demande de devis pour site e-commerce",
      message: "Bonjour, je souhaiterais obtenir un devis pour la création d'un site e-commerce pour ma boutique de vêtements. J'ai besoin d'un système de paiement sécurisé et d'une gestion des stocks. Pouvez-vous me contacter pour en discuter ?",
      status: "unread",
      priority: "high",
      createdAt: "2024-01-20T10:30:00Z",
      readAt: null
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@entreprise.fr",
      phone: "+33 1 23 45 67 89",
      subject: "Refonte de site web d'entreprise",
      message: "Nous souhaitons refondre notre site web corporate. Nous avons besoin d'un design moderne et responsive, ainsi que d'un système de gestion de contenu. Notre budget est d'environ 5000€. Êtes-vous disponible pour ce projet ?",
      status: "read",
      priority: "medium",
      createdAt: "2024-01-19T14:15:00Z",
      readAt: "2024-01-19T16:20:00Z"
    }
  ]

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, statusFilter])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      
      // Charger les messages depuis le backend
      const response = await apiService.getContactMessages()
      const backendMessages = response.data.data
      
      // Adapter les données du backend au format attendu par l'interface
      const adaptedMessages = backendMessages.map(message => ({
        id: message._id || message.id,
        name: message.name,
        email: message.email,
        phone: message.phone || '', // Téléphone du backend
        subject: message.subject || 'Message de contact', // Sujet du backend
        message: message.message,
        status: message.read ? 'read' : 'unread',
        priority: message.priority || 'medium', // Priorité du backend
        createdAt: message.createdAt,
        readAt: message.read ? message.readAt || message.createdAt : null
      }))
      
      setMessages(adaptedMessages)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
      toast.error('Erreur lors du chargement des messages depuis le backend')
      
      // Fallback sur les données simulées en cas d'erreur
      setMessages(initialMessages)
      setIsLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredMessages(filtered)
  }

  const handleMarkAsRead = async (id) => {
    try {
      // Marquer comme lu via l'API backend
      await apiService.markMessageAsRead(id)
      
      // Mettre à jour l'état local
      setMessages(messages.map(msg => 
        msg.id === id 
          ? { ...msg, status: 'read', readAt: new Date().toISOString() }
          : msg
      ))
      toast.success('Message marqué comme lu')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur lors de la mise à jour du message')
    }
  }

  const handleDeleteMessage = async (id) => {
    try {
      // Supprimer le message via l'API backend
      await apiService.deleteMessage(id)
      
      // Mettre à jour l'état local après suppression réussie
      setMessages(messages.filter(msg => msg.id !== id))
      toast.success('Message supprimé avec succès')
      setShowDeleteModal(false)
      setMessageToDelete(null)
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du message')
    }
  }

  const handleReply = (message, inModal = false) => {
    if (inModal) {
      // Si on est dans le modal, on active la zone de réponse dans le modal
      setShowReplyInModal(!showReplyInModal)
      if (!showReplyInModal) {
        setReplySubject(`Re: ${message.subject}`)
        setReplyContent('')
        setSentReply('')
      } else {
        setReplyContent('')
        setReplySubject('')
        setSentReply('')
      }
    } else {
      // Logique originale pour la liste
      if (replyingToMessage && replyingToMessage.id === message.id) {
        setReplyingToMessage(null)
        setReplyContent('')
        setReplySubject('')
      } else {
        setReplyingToMessage(message)
        setReplySubject(`Re: ${message.subject}`)
        setReplyContent('')
      }
    }
  }

  const handleSendReply = async (fromModal = false) => {
    if (!replyContent.trim()) {
      toast.error('Veuillez saisir un message')
      return
    }

    setIsSubmittingReply(true)

    try {
      const targetMessage = fromModal ? selectedMessage : replyingToMessage
      // Créer le lien mailto avec le contenu
      const mailtoLink = `mailto:${targetMessage.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyContent)}`
      window.open(mailtoLink, '_blank')
      
      toast.success('Client email ouvert pour envoyer la réponse')
      
      // Sauvegarder la réponse envoyée et vider le champ de saisie
      if (fromModal) {
        setSentReply(replyContent)
        setReplyContent('')
      } else {
        setReplyingToMessage(null)
        setReplyContent('')
        setReplySubject('')
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du client email:', error)
      toast.error('Erreur lors de l\'ouverture du client email')
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const getStatusColor = (status) => {
    return status === 'read' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }

  const getStatusText = (status) => {
    return status === 'read' ? 'Lu' : 'Non lu'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Haute'
      case 'medium':
        return 'Moyenne'
      case 'low':
        return 'Basse'
      default:
        return 'Moyenne'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
          <div>
            <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-30 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages de contact
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 space-y-6">
        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher dans les messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les messages</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredMessages.length} message(s) trouvé(s)
            </p>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer ${
                message.status === 'unread' ? 'ring-2 ring-blue-100 dark:ring-blue-900/20' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message)
                if (message.status === 'unread') {
                  handleMarkAsRead(message.id)
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center">
                      {message.status === 'unread' ? (
                        <Mail className="w-5 h-5 text-blue-500 mr-2" />
                      ) : (
                        <MailOpen className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      <h3 className={`text-lg font-semibold ${
                        message.status === 'unread' 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {message.name}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                      {getStatusText(message.status)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {message.email}
                  </p>
                  
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    message.status === 'unread' 
                      ? 'text-gray-900 dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    <span className="font-medium">{message.subject}</span> - {message.message}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReply(message)
                    }}
                    className={`p-2 transition-colors ${
                      replyingToMessage && replyingToMessage.id === message.id
                        ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-blue-500'
                    }`}
                    title={replyingToMessage && replyingToMessage.id === message.id ? "Fermer la réponse" : "Répondre"}
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Zone de réponse */}
              {replyingToMessage && replyingToMessage.id === message.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Répondre à {message.name}
                    </h4>
                    
                    {/* Sujet */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sujet
                      </label>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Sujet de la réponse"
                      />
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Votre réponse
                      </label>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        placeholder="Tapez votre réponse ici..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setReplyingToMessage(null)
                          setReplyContent('')
                          setReplySubject('')
                        }}
                        className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={isSubmittingReply || !replyContent.trim()}
                        className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmittingReply ? (
                          <>
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            Envoyer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* État vide */}
        {filteredMessages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun message trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Vous n\'avez pas encore reçu de messages.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails du message */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Message de {selectedMessage.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedMessage(null)
                    setShowReplyInModal(false)
                    setReplyContent('')
                    setReplySubject('')
                    setSentReply('')
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Informations de contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom
                    </label>
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedMessage.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Téléphone
                      </label>
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`tel:${selectedMessage.phone}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date de réception
                    </label>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(selectedMessage.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sujet
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium text-lg">
                    {selectedMessage.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleReply(selectedMessage, true)}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      showReplyInModal 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    {showReplyInModal ? 'Fermer réponse' : 'Répondre'}
                  </button>
                </div>

                {/* Zone de réponse dans le modal */}
                {showReplyInModal && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {/* Affichage de la réponse envoyée */}
                    {sentReply && (
                      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                              Réponse envoyée
                            </p>
                            <div className="text-sm text-green-700 dark:text-green-300 bg-white dark:bg-green-900/30 p-3 rounded border whitespace-pre-wrap">
                              {sentReply}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Champ de nouvelle réponse */}
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-4"
                      placeholder={sentReply ? "Tapez une nouvelle réponse..." : "Tapez votre réponse ici..."}
                    />

                    {/* Actions de réponse */}
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowReplyInModal(false)
                          setReplyContent('')
                          setReplySubject('')
                          setSentReply('')
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() => handleSendReply(true)}
                        disabled={isSubmittingReply || !replyContent.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmittingReply ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {sentReply ? 'Envoyer une autre réponse' : 'Envoyer la réponse'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réponse */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Répondre à {selectedMessage.name}
                </h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyContent('')
                    setReplySubject('')
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Destinataire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    À
                  </label>
                  <div className="flex items-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {selectedMessage.email}
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Tapez votre réponse ici..."
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSendReply}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer la réponse
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyModal(false)
                      setReplyContent('')
                      setReplySubject('')
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && messageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Supprimer le message
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer le message de "{messageToDelete.name}" ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setMessageToDelete(null)
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteMessage(messageToDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
