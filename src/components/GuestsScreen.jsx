import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '../components/FormComponents';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Upload,
  Search,
  Filter,
  UserPlus,
  Calendar,
  Clock
} from 'lucide-react';

const GuestsScreen = ({ onBack }) => {
  const [guests, setGuests] = useState([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-1111',
      status: 'confirmado',
      category: 'familia',
      invitedAt: new Date('2024-12-01'),
      respondedAt: new Date('2024-12-02'),
      notes: 'Tia querida, não come carne vermelha'
    },
    {
      id: '2',
      name: 'Pedro Santos',
      email: 'pedro@email.com',
      phone: '(11) 99999-2222',
      status: 'pendente',
      category: 'amigos',
      invitedAt: new Date('2024-12-01'),
      respondedAt: null,
      notes: ''
    },
    {
      id: '3',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 99999-3333',
      status: 'recusou',
      category: 'trabalho',
      invitedAt: new Date('2024-12-01'),
      respondedAt: new Date('2024-12-03'),
      notes: 'Vai viajar no final de semana'
    },
    {
      id: '4',
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      phone: '(11) 99999-4444',
      status: 'confirmado',
      category: 'amigos',
      invitedAt: new Date('2024-12-01'),
      respondedAt: new Date('2024-12-01'),
      notes: 'Vai levar a esposa'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'amigos',
    notes: ''
  });

  const statusOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Confirmado', value: 'confirmado' },
    { label: 'Pendente', value: 'pendente' },
    { label: 'Recusou', value: 'recusou' }
  ];

  const categoryOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Família', value: 'familia' },
    { label: 'Amigos', value: 'amigos' },
    { label: 'Trabalho', value: 'trabalho' },
    { label: 'Vizinhos', value: 'vizinhos' },
    { label: 'Outros', value: 'outros' }
  ];

  const guestCategories = categoryOptions.filter(cat => cat.value !== 'todos');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || guest.status === statusFilter;
    const matchesCategory = categoryFilter === 'todos' || guest.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const addGuest = () => {
    if (!newGuest.name || !newGuest.email) return;

    const guest = {
      ...newGuest,
      id: Date.now().toString(),
      status: 'pendente',
      invitedAt: new Date(),
      respondedAt: null
    };

    setGuests(prev => [...prev, guest]);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      category: 'amigos',
      notes: ''
    });
    setShowAddGuest(false);
  };

  const updateGuest = () => {
    if (!editingGuest.name || !editingGuest.email) return;

    setGuests(prev => 
      prev.map(guest => 
        guest.id === editingGuest.id ? editingGuest : guest
      )
    );
    setEditingGuest(null);
  };

  const deleteGuest = (guestId) => {
    setGuests(prev => prev.filter(guest => guest.id !== guestId));
  };

  const updateGuestStatus = (guestId, newStatus) => {
    setGuests(prev => 
      prev.map(guest => 
        guest.id === guestId 
          ? { 
              ...guest, 
              status: newStatus, 
              respondedAt: new Date() 
            }
          : guest
      )
    );
  };

  const sendInvitation = (guest) => {
    const message = encodeURIComponent(
      `Olá ${guest.name}! Você está convidado(a) para minha festa de aniversário! 🎉\n\nConfirme sua presença respondendo a esta mensagem.\n\nEspero você lá!`
    );
    window.open(`https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const exportGuestList = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Status', 'Categoria', 'Observações'],
      ...guests.map(guest => [
        guest.name,
        guest.email,
        guest.phone,
        guest.status,
        guest.category,
        guest.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-convidados.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'recusou': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado': return <Check size={12} />;
      case 'pendente': return <Clock size={12} />;
      case 'recusou': return <X size={12} />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'familia': return 'bg-blue-100 text-blue-800';
      case 'amigos': return 'bg-purple-100 text-purple-800';
      case 'trabalho': return 'bg-orange-100 text-orange-800';
      case 'vizinhos': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: guests.length,
    confirmados: guests.filter(g => g.status === 'confirmado').length,
    pendentes: guests.filter(g => g.status === 'pendente').length,
    recusaram: guests.filter(g => g.status === 'recusou').length
  };

  const GuestCard = ({ guest }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{guest.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getStatusColor(guest.status)}>
                  {getStatusIcon(guest.status)}
                  <span className="ml-1 capitalize">{guest.status}</span>
                </Badge>
                <Badge className={getCategoryColor(guest.category)}>
                  {guest.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingGuest(guest)}
              >
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteGuest(guest.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail size={14} className="mr-2" />
              {guest.email}
            </div>
            {guest.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone size={14} className="mr-2" />
                {guest.phone}
              </div>
            )}
            {guest.notes && (
              <div className="text-sm text-muted-foreground">
                <strong>Obs:</strong> {guest.notes}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {guest.status === 'pendente' && (
              <>
                <Button
                  size="sm"
                  onClick={() => updateGuestStatus(guest.id, 'confirmado')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check size={14} className="mr-1" />
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateGuestStatus(guest.id, 'recusou')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X size={14} className="mr-1" />
                  Recusou
                </Button>
              </>
            )}

            {guest.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => sendInvitation(guest)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <MessageCircle size={14} className="mr-1" />
                Convidar
              </Button>
            )}
          </div>

          {guest.respondedAt && (
            <div className="text-xs text-muted-foreground mt-2">
              Respondeu em {guest.respondedAt.toLocaleDateString('pt-BR')}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const GuestForm = ({ guest, onSave, onCancel, isEditing = false }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {isEditing ? 'Editar Convidado' : 'Adicionar Convidado'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Nome Completo"
            placeholder="Ex: Maria Silva"
            value={guest.name}
            onChange={(e) => isEditing 
              ? setEditingGuest(prev => ({ ...prev, name: e.target.value }))
              : setNewGuest(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="maria@email.com"
            value={guest.email}
            onChange={(e) => isEditing 
              ? setEditingGuest(prev => ({ ...prev, email: e.target.value }))
              : setNewGuest(prev => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <FormInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={guest.phone}
            onChange={(e) => isEditing 
              ? setEditingGuest(prev => ({ ...prev, phone: e.target.value }))
              : setNewGuest(prev => ({ ...prev, phone: e.target.value }))
            }
          />

          <FormSelect
            label="Categoria"
            options={guestCategories}
            value={guest.category}
            onValueChange={(value) => isEditing 
              ? setEditingGuest(prev => ({ ...prev, category: value }))
              : setNewGuest(prev => ({ ...prev, category: value }))
            }
          />

          <FormInput
            label="Observações"
            placeholder="Restrições alimentares, preferências..."
            value={guest.notes}
            onChange={(e) => isEditing 
              ? setEditingGuest(prev => ({ ...prev, notes: e.target.value }))
              : setNewGuest(prev => ({ ...prev, notes: e.target.value }))
            }
          />

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={onSave} className="flex-1 bg-primary-custom hover:bg-primary-custom/90">
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const ImportModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Importar Contatos</h3>
          <Button variant="ghost" size="icon" onClick={() => setShowImportModal(false)}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Upload className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground mb-4">
              Importe seus contatos de um arquivo CSV
            </p>
            
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={(e) => {
                // Aqui implementaria a lógica de importação
                alert('Funcionalidade de importação será implementada');
              }}
            />
            
            <Button
              onClick={() => document.getElementById('csv-upload').click()}
              className="w-full mb-4"
            >
              <Upload size={20} className="mr-2" />
              Selecionar Arquivo CSV
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Formato do arquivo:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Nome, Email, Telefone, Categoria</div>
              <div>• Uma linha por convidado</div>
              <div>• Primeira linha deve conter os cabeçalhos</div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowImportModal(false)}
            className="w-full"
          >
            Fechar
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-custom pt-12 pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/20 mr-4"
              >
                <ArrowLeft size={24} />
              </Button>
              <div className="flex items-center">
                <Users className="text-white mr-3" size={28} />
                <h1 className="text-white text-2xl font-bold">
                  Convidados
                </h1>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowImportModal(true)}
                className="bg-white text-primary-custom hover:bg-gray-100"
              >
                <Upload size={20} className="mr-2" />
                Importar
              </Button>
              <Button
                onClick={exportGuestList}
                className="bg-white text-primary-custom hover:bg-gray-100"
              >
                <Download size={20} className="mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowAddGuest(true)}
                className="bg-accent-custom text-white hover:bg-accent-custom/90"
              >
                <Plus size={20} className="mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            Gerencie sua lista de convidados e acompanhe as confirmações
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 max-w-6xl mx-auto">
        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-custom">
                    {stats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.confirmados}
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pendentes}
                  </div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.recusaram}
                  </div>
                  <div className="text-sm text-muted-foreground">Recusaram</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <FormInput
                    placeholder="Buscar convidados..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <FormSelect
                  placeholder="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                />

                <FormSelect
                  placeholder="Categoria"
                  options={categoryOptions}
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de convidados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {filteredGuests.length === 0 ? (
            <div className="md:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-lg font-semibold mb-2">Nenhum convidado encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {guests.length === 0 
                      ? 'Comece adicionando seus primeiros convidados'
                      : 'Tente ajustar os filtros de busca'
                    }
                  </p>
                  <Button
                    onClick={() => setShowAddGuest(true)}
                    className="bg-primary-custom hover:bg-primary-custom/90"
                  >
                    <Plus size={20} className="mr-2" />
                    Adicionar Convidado
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <GuestCard key={guest.id} guest={guest} />
            ))
          )}
        </div>
      </div>

      {/* Modais */}
      {showAddGuest && (
        <GuestForm
          guest={newGuest}
          onSave={addGuest}
          onCancel={() => setShowAddGuest(false)}
        />
      )}

      {editingGuest && (
        <GuestForm
          guest={editingGuest}
          onSave={updateGuest}
          onCancel={() => setEditingGuest(null)}
          isEditing={true}
        />
      )}

      {showImportModal && <ImportModal />}
    </div>
  );
};

export default GuestsScreen;

