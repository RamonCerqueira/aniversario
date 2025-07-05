import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '../components/FormComponents';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Gift,
  Utensils
} from 'lucide-react';

const CalendarScreen = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Reservar local da festa',
      description: 'Ligar para a chácara e confirmar disponibilidade',
      date: new Date('2024-12-20'),
      time: '14:00',
      type: 'tarefa',
      priority: 'alta',
      completed: true,
      reminder: true,
      location: 'Chácara da família Silva'
    },
    {
      id: '2',
      title: 'Comprar decoração',
      description: 'Balões, faixas, toalhas de mesa temáticas',
      date: new Date('2024-12-22'),
      time: '10:00',
      type: 'compras',
      priority: 'media',
      completed: false,
      reminder: true,
      location: 'Shopping Center'
    },
    {
      id: '3',
      title: 'Confirmar cardápio com fornecedor',
      description: 'Definir quantidade de carnes e acompanhamentos',
      date: new Date('2024-12-25'),
      time: '16:00',
      type: 'fornecedor',
      priority: 'alta',
      completed: false,
      reminder: true,
      location: 'Churrascaria do João'
    },
    {
      id: '4',
      title: 'Enviar convites finais',
      description: 'Enviar lembretes para convidados que não responderam',
      date: new Date('2024-12-28'),
      time: '19:00',
      type: 'convidados',
      priority: 'alta',
      completed: false,
      reminder: true,
      location: ''
    },
    {
      id: '5',
      title: 'FESTA DE ANIVERSÁRIO! 🎉',
      description: 'Aniversário de 35 anos do João',
      date: new Date('2025-01-15'),
      time: '18:00',
      type: 'festa',
      priority: 'alta',
      completed: false,
      reminder: true,
      location: 'Chácara da família Silva'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'tarefa',
    priority: 'media',
    reminder: true,
    location: ''
  });

  const eventTypes = [
    { label: 'Tarefa', value: 'tarefa' },
    { label: 'Compras', value: 'compras' },
    { label: 'Fornecedor', value: 'fornecedor' },
    { label: 'Convidados', value: 'convidados' },
    { label: 'Festa', value: 'festa' },
    { label: 'Outro', value: 'outro' }
  ];

  const priorities = [
    { label: 'Alta', value: 'alta' },
    { label: 'Média', value: 'media' },
    { label: 'Baixa', value: 'baixa' }
  ];

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event = {
      ...newEvent,
      id: Date.now().toString(),
      date: new Date(newEvent.date),
      completed: false
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'tarefa',
      priority: 'media',
      reminder: true,
      location: ''
    });
    setShowAddEvent(false);
  };

  const updateEvent = () => {
    if (!editingEvent.title || !editingEvent.date) return;

    const updatedEvent = {
      ...editingEvent,
      date: new Date(editingEvent.date)
    };

    setEvents(prev => 
      prev.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      )
    );
    setEditingEvent(null);
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const toggleEventComplete = (eventId) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, completed: !event.completed }
          : event
      )
    );
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'tarefa': return 'bg-blue-100 text-blue-800';
      case 'compras': return 'bg-green-100 text-green-800';
      case 'fornecedor': return 'bg-purple-100 text-purple-800';
      case 'convidados': return 'bg-pink-100 text-pink-800';
      case 'festa': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'tarefa': return <CheckCircle size={14} />;
      case 'compras': return <Gift size={14} />;
      case 'fornecedor': return <Utensils size={14} />;
      case 'convidados': return <Users size={14} />;
      case 'festa': return <CalendarIcon size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    ).sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => event.date >= today && !event.completed)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  const getPendingTasks = () => {
    return events.filter(event => !event.completed && event.type !== 'festa');
  };

  const getCompletedTasks = () => {
    return events.filter(event => event.completed);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`shadow-lg hover:shadow-xl transition-shadow ${event.completed ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getEventTypeColor(event.type)}>
                  {getEventTypeIcon(event.type)}
                  <span className="ml-1 capitalize">{event.type}</span>
                </Badge>
                <Badge className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
                {event.reminder && (
                  <Badge variant="outline">
                    <Bell size={12} className="mr-1" />
                    Lembrete
                  </Badge>
                )}
              </div>
              
              <h3 className={`font-semibold mb-1 ${event.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {event.title}
              </h3>
              
              {event.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  {formatDate(event.date)}
                </div>
                {event.time && (
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {formatTime(event.time)}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-1 ml-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleEventComplete(event.id)}
                className={event.completed ? 'text-green-600 border-green-600' : ''}
              >
                <CheckCircle size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingEvent({
                  ...event,
                  date: event.date.toISOString().split('T')[0]
                })}
              >
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          {isToday(event.date) && !event.completed && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-800">
              📅 Hoje!
            </div>
          )}
          
          {isPast(event.date) && !event.completed && (
            <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
              ⚠️ Atrasado
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const EventForm = ({ event, onSave, onCancel, isEditing = false }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {isEditing ? 'Editar Evento' : 'Adicionar Evento'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Título"
            placeholder="Ex: Reservar local da festa"
            value={event.title}
            onChange={(e) => isEditing 
              ? setEditingEvent(prev => ({ ...prev, title: e.target.value }))
              : setNewEvent(prev => ({ ...prev, title: e.target.value }))
            }
            required
          />

          <FormInput
            label="Descrição"
            placeholder="Detalhes do evento..."
            value={event.description}
            onChange={(e) => isEditing 
              ? setEditingEvent(prev => ({ ...prev, description: e.target.value }))
              : setNewEvent(prev => ({ ...prev, description: e.target.value }))
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Data"
              type="date"
              value={event.date}
              onChange={(e) => isEditing 
                ? setEditingEvent(prev => ({ ...prev, date: e.target.value }))
                : setNewEvent(prev => ({ ...prev, date: e.target.value }))
              }
              required
            />

            <FormInput
              label="Horário"
              type="time"
              value={event.time}
              onChange={(e) => isEditing 
                ? setEditingEvent(prev => ({ ...prev, time: e.target.value }))
                : setNewEvent(prev => ({ ...prev, time: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Tipo"
              options={eventTypes}
              value={event.type}
              onValueChange={(value) => isEditing 
                ? setEditingEvent(prev => ({ ...prev, type: value }))
                : setNewEvent(prev => ({ ...prev, type: value }))
              }
            />

            <FormSelect
              label="Prioridade"
              options={priorities}
              value={event.priority}
              onValueChange={(value) => isEditing 
                ? setEditingEvent(prev => ({ ...prev, priority: value }))
                : setNewEvent(prev => ({ ...prev, priority: value }))
              }
            />
          </div>

          <FormInput
            label="Local (opcional)"
            placeholder="Ex: Shopping Center"
            value={event.location}
            onChange={(e) => isEditing 
              ? setEditingEvent(prev => ({ ...prev, location: e.target.value }))
              : setNewEvent(prev => ({ ...prev, location: e.target.value }))
            }
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reminder"
              checked={event.reminder}
              onChange={(e) => isEditing 
                ? setEditingEvent(prev => ({ ...prev, reminder: e.target.checked }))
                : setNewEvent(prev => ({ ...prev, reminder: e.target.checked }))
              }
              className="rounded"
            />
            <label htmlFor="reminder" className="text-sm">
              Ativar lembrete
            </label>
          </div>

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

  const CalendarView = () => {
    const days = generateCalendarDays();
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2" size={20} />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
              const isTodayDate = isToday(day);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-1 border rounded cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                    ${isSelected ? 'ring-2 ring-primary-custom' : ''}
                    ${isTodayDate ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                    hover:bg-gray-50
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const upcomingEvents = getUpcomingEvents();
  const pendingTasks = getPendingTasks();
  const completedTasks = getCompletedTasks();

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
                <CalendarIcon className="text-white mr-3" size={28} />
                <h1 className="text-white text-2xl font-bold">
                  Calendário de Planejamento
                </h1>
              </div>
            </div>
            
            <Button
              onClick={() => setShowAddEvent(true)}
              className="bg-accent-custom text-white hover:bg-accent-custom/90"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Evento
            </Button>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            Organize todas as tarefas e marcos importantes da sua festa
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
                    {events.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingTasks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedTasks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-custom">
                    {upcomingEvents.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Próximos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CalendarView />
            </motion.div>
          </div>

          {/* Sidebar com próximos eventos */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 text-yellow-600" size={20} />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Nenhum evento próximo
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="border-l-4 border-primary-custom pl-3">
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(event.date)} {event.time && `às ${event.time}`}
                          </div>
                          <Badge className={getEventTypeColor(event.type)} size="sm">
                            {event.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Eventos em {formatDate(selectedDate)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Nenhum evento nesta data
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {getEventsForDate(selectedDate).map(event => (
                          <div key={event.id} className="text-sm">
                            <div className="font-medium">{event.title}</div>
                            {event.time && (
                              <div className="text-xs text-muted-foreground">
                                {event.time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Lista de todos os eventos */}
        <div className="mt-8 space-y-4 pb-8">
          <h2 className="text-xl font-bold">Todos os Eventos</h2>
          {events.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Nenhum evento cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando tarefas e marcos importantes para sua festa
                </p>
                <Button
                  onClick={() => setShowAddEvent(true)}
                  className="bg-primary-custom hover:bg-primary-custom/90"
                >
                  <Plus size={20} className="mr-2" />
                  Adicionar Primeiro Evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events
                .sort((a, b) => a.date - b.date)
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {showAddEvent && (
        <EventForm
          event={newEvent}
          onSave={addEvent}
          onCancel={() => setShowAddEvent(false)}
        />
      )}

      {editingEvent && (
        <EventForm
          event={editingEvent}
          onSave={updateEvent}
          onCancel={() => setEditingEvent(null)}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default CalendarScreen;

