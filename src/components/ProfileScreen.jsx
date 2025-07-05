import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '../components/FormComponents';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Edit, 
  Save,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  LogOut,
  Settings,
  Crown,
  Gift,
  Users,
  Star,
  Award
} from 'lucide-react';

const ProfileScreen = ({ onBack }) => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
    address: user?.address || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      reminders: true
    },
    privacy: {
      profilePublic: false,
      showEmail: false,
      showPhone: false
    },
    theme: 'light',
    language: 'pt-BR'
  });

  const [stats] = useState({
    partiesCreated: 12,
    guestsInvited: 340,
    suppliersContacted: 25,
    averageRating: 4.8,
    memberSince: new Date('2024-01-15')
  });

  const saveProfile = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthday: user?.birthday || '',
      address: user?.address || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const exportData = () => {
    // Simular exportação de dados
    const userData = {
      profile: user,
      preferences: preferences,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-dados-aniversariapp.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm('ATENÇÃO: Esta ação é irreversível. Tem certeza que deseja excluir sua conta permanentemente?')) {
      if (confirm('Digite "EXCLUIR" para confirmar:') === 'EXCLUIR') {
        // Aqui implementaria a exclusão da conta
        alert('Conta excluída com sucesso. Você será redirecionado.');
        logout();
      }
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Informações básicas */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="mr-2" size={20} />
              Informações Pessoais
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveProfile}
                  className="bg-primary-custom hover:bg-primary-custom/90"
                >
                  <Save size={16} className="mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={editedUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera size={14} />
                </Button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-muted-foreground">
                Membro desde {stats.memberSince.toLocaleDateString('pt-BR')}
              </p>
              <Badge className="bg-accent-custom text-white mt-1">
                <Crown size={12} className="mr-1" />
                Usuário Premium
              </Badge>
            </div>
          </div>

          {/* Campos editáveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nome Completo"
              value={editedUser.name}
              onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
              required
            />

            <FormInput
              label="Email"
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              required
            />

            <FormInput
              label="Telefone"
              value={editedUser.phone}
              onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />

            <FormInput
              label="Data de Aniversário"
              type="date"
              value={editedUser.birthday}
              onChange={(e) => setEditedUser(prev => ({ ...prev, birthday: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <FormInput
            label="Endereço"
            value={editedUser.address}
            onChange={(e) => setEditedUser(prev => ({ ...prev, address: e.target.value }))}
            disabled={!isEditing}
            placeholder="Rua, número, bairro, cidade, estado"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Biografia</label>
            <textarea
              value={editedUser.bio}
              onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              placeholder="Conte um pouco sobre você..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 disabled:bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2" size={20} />
            Suas Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-custom">
                {stats.partiesCreated}
              </div>
              <div className="text-sm text-muted-foreground">Festas Criadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-custom">
                {stats.guestsInvited}
              </div>
              <div className="text-sm text-muted-foreground">Convidados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-custom">
                {stats.suppliersContacted}
              </div>
              <div className="text-sm text-muted-foreground">Fornecedores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                <Star className="fill-current mr-1" size={20} />
                {stats.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Notificações */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" size={20} />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notificações por Email</div>
              <div className="text-sm text-muted-foreground">Receber atualizações por email</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, email: e.target.checked }
              }))}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Notificações Push</div>
              <div className="text-sm text-muted-foreground">Receber notificações no navegador</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, push: e.target.checked }
              }))}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">SMS</div>
              <div className="text-sm text-muted-foreground">Receber lembretes por SMS</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, sms: e.target.checked }
              }))}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Lembretes de Eventos</div>
              <div className="text-sm text-muted-foreground">Receber lembretes de tarefas e eventos</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications.reminders}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, reminders: e.target.checked }
              }))}
              className="rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2" size={20} />
            Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Perfil Público</div>
              <div className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.privacy.profilePublic}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                privacy: { ...prev.privacy, profilePublic: e.target.checked }
              }))}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Mostrar Email</div>
              <div className="text-sm text-muted-foreground">Exibir email no perfil público</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.privacy.showEmail}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                privacy: { ...prev.privacy, showEmail: e.target.checked }
              }))}
              className="rounded"
              disabled={!preferences.privacy.profilePublic}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Mostrar Telefone</div>
              <div className="text-sm text-muted-foreground">Exibir telefone no perfil público</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.privacy.showPhone}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                privacy: { ...prev.privacy, showPhone: e.target.checked }
              }))}
              className="rounded"
              disabled={!preferences.privacy.profilePublic}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2" size={20} />
            Aparência e Idioma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            label="Tema"
            options={[
              { label: 'Claro', value: 'light' },
              { label: 'Escuro', value: 'dark' },
              { label: 'Automático', value: 'auto' }
            ]}
            value={preferences.theme}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}
          />

          <FormSelect
            label="Idioma"
            options={[
              { label: 'Português (Brasil)', value: 'pt-BR' },
              { label: 'English', value: 'en-US' },
              { label: 'Español', value: 'es-ES' }
            ]}
            value={preferences.language}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
          />
        </CardContent>
      </Card>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      {/* Exportar dados */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2" size={20} />
            Exportar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Baixe uma cópia de todos os seus dados do AniversariApp em formato JSON.
          </p>
          <Button
            onClick={exportData}
            className="bg-primary-custom hover:bg-primary-custom/90"
          >
            <Download size={16} className="mr-2" />
            Baixar Meus Dados
          </Button>
        </CardContent>
      </Card>

      {/* Excluir conta */}
      <Card className="shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2" size={20} />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600 mb-2">Excluir Conta</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Esta ação é irreversível. Todos os seus dados, festas, convidados e configurações serão permanentemente excluídos.
              </p>
              <Button
                onClick={deleteAccount}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Excluir Conta Permanentemente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'data', label: 'Dados', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-custom pt-12 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
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
                <User className="text-white mr-3" size={28} />
                <h1 className="text-white text-2xl font-bold">
                  Meu Perfil
                </h1>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              className="bg-white text-primary-custom hover:bg-gray-100"
            >
              <LogOut size={20} className="mr-2" />
              Sair
            </Button>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 max-w-4xl mx-auto">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-0">
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center px-6 py-4 font-medium transition-colors
                        ${activeTab === tab.id 
                          ? 'text-primary-custom border-b-2 border-primary-custom bg-blue-50' 
                          : 'text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <Icon size={20} className="mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conteúdo das tabs */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pb-8"
        >
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'data' && <DataTab />}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;

