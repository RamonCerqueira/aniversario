import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useParty } from '../contexts/PartyContext';
import { AnimatedHeader } from '../components/AnimatedHeader';
import { StatusCard, QuickActionCard, ProgressCard } from '../components/Cards';

const HomeScreen = ({ onCreateParty, onViewParty, onNavigate }) => {
  const { user } = useAuth();
  const { parties, loadParties } = useParty();

  useEffect(() => {
    loadParties();
  }, []);

  const handleNotificationPress = () => {
    alert('Nenhuma notificação no momento');
  };

  const handleCreateParty = () => {
    onCreateParty();
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'guests':
        onNavigate('guests');
        break;
      case 'consumption':
        onNavigate('consumption');
        break;
      case 'checklist':
        onNavigate('calendar');
        break;
      case 'suppliers':
        onNavigate('suppliers');
        break;
      case 'gift-list':
        onNavigate('gift-list');
        break;
      case 'profile':
        onNavigate('profile');
        break;
    }
  };

  // Calcular progresso baseado nas festas criadas
  const calculateProgress = () => {
    const hasParties = parties.length > 0;
    const hasCompleteParty = parties.some(party => 
      party.name && party.type && party.date && party.location
    );
    
    return [
      { 
        title: 'Detalhes da festa', 
        progress: hasCompleteParty ? 100 : hasParties ? 50 : 0 
      },
      { title: 'Lista de convidados', progress: 0 },
      { title: 'Fornecedores', progress: 0 },
      { title: 'Checklist', progress: 0 },
    ];
  };

  const getNextParty = () => {
    const now = new Date();
    const upcomingParties = parties
      .filter(party => party.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return upcomingParties[0];
  };

  const nextParty = getNextParty();
  const progressData = calculateProgress();

  return (
    <div className="min-h-screen bg-background itens">
      {/* Header Animado */}
      <AnimatedHeader
        userName={user?.name || 'Usuário'}
        onNotificationPress={handleNotificationPress}
      />

      {/* Dashboard Cards */}
      <div className="px-6 -mt-4 max-w-6xl mx-auto">
        {/* Status Card */}
        <StatusCard
          title={nextParty ? nextParty.name : 'Sua Próxima Festa'}
          subtitle={
            nextParty 
              ? `${nextParty.date.toLocaleDateString('pt-BR')} - ${nextParty.location}`
              : 'Planeje sua celebração perfeita'
          }
          icon="calendar"
          iconColor="#FFD700"
          buttonText={nextParty ? 'Ver Detalhes' : 'Criar Nova Festa'}
          onPress={() => {
            if (nextParty) {
              onViewParty(nextParty.id);
            } else {
              handleCreateParty();
            }
          }}
          delay={200}
        />

        {/* Estatísticas Rápidas */}
        {parties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 mt-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Suas Festas
            </h2>
            <div className="bg-card rounded-xl p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6, damping: 15 }}
                    className="text-2xl font-bold text-primary-custom"
                  >
                    {parties.length}
                  </motion.div>
                  <p className="text-muted-foreground text-sm">
                    Total de Festas
                  </p>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7, damping: 15 }}
                    className="text-2xl font-bold text-secondary-custom"
                  >
                    {parties.filter(p => p.date > new Date()).length}
                  </motion.div>
                  <p className="text-muted-foreground text-sm">
                    Próximas
                  </p>
                </div>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.8, damping: 15 }}
                    className="text-2xl font-bold text-accent-custom"
                  >
                    {parties.reduce((sum, p) => sum + p.guestCount, 0)}
                  </motion.div>
                  <p className="text-muted-foreground text-sm">
                    Convidados
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 mt-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <QuickActionCard
              icon="users"
              title="Convidados"
              subtitle="Gerenciar lista"
              color="#4169E1"
              onPress={() => handleQuickAction('guests')}
              delay={600}
            />
            <QuickActionCard
              icon="utensils"
              title="Churrascômetro"
              subtitle="Calcular consumo"
              color="#FF1493"
              onPress={() => handleQuickAction('consumption')}
              delay={700}
            />
            <QuickActionCard
              icon="building"
              title="Fornecedores"
              subtitle="Encontrar serviços"
              color="#32CD32"
              onPress={() => handleQuickAction('suppliers')}
              delay={800}
            />
            <QuickActionCard
              icon="gift"
              title="Lista de Presentes"
              subtitle="Gerenciar presentes"
              color="#9932CC"
              onPress={() => handleQuickAction('gift-list')}
              delay={900}
            />
            <QuickActionCard
              icon="calendar"
              title="Calendário"
              subtitle="Planejar tarefas"
              color="#FFD700"
              onPress={() => handleQuickAction('checklist')}
              delay={1000}
            />
            <QuickActionCard
              icon="user"
              title="Perfil"
              subtitle="Configurações"
              color="#FF6347"
              onPress={() => handleQuickAction('profile')}
              delay={1100}
            />
          </div>
        </motion.div>

        {/* Progress Overview */}
        <ProgressCard
          title="Progresso do Planejamento"
          items={progressData}
          delay={1000}
        />

        {/* Espaçamento inferior */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default HomeScreen;

