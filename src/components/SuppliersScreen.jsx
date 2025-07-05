import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '../components/FormComponents';
import { useSuppliers } from '../contexts/SuppliersContext';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  MessageCircle,
  Star,
  Filter,
  Plus,
  Crown,
  Users,
  Clock,
  CreditCard
} from 'lucide-react';

const SuppliersScreen = ({ onBack }) => {
  const { 
    suppliers, 
    supplierTypes, 
    searchSuppliers, 
    getUserLocation, 
    userLocation,
    calculateDistance 
  } = useSuppliers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [useGeolocation, setUseGeolocation] = useState(false);

  useEffect(() => {
    const filters = {
      type: selectedType,
      location: useGeolocation ? userLocation : null,
      maxDistance: maxDistance
    };
    
    const results = searchSuppliers(searchQuery, filters);
    setFilteredSuppliers(results);
  }, [searchQuery, selectedType, suppliers, userLocation, useGeolocation, maxDistance]);

  const handleLocationToggle = () => {
    if (!useGeolocation && !userLocation) {
      getUserLocation();
    }
    setUseGeolocation(!useGeolocation);
  };

  const openWhatsApp = (phone, name) => {
    const message = encodeURIComponent(`Olá ${name}! Vi seu perfil no AniversariApp e gostaria de saber mais sobre seus serviços para minha festa.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const openInstagram = (instagram) => {
    window.open(`https://instagram.com/${instagram.replace('@', '')}`, '_blank');
  };

  const sendEmail = (email, name) => {
    const subject = encodeURIComponent('Contato via AniversariApp');
    const body = encodeURIComponent(`Olá ${name}!\n\nVi seu perfil no AniversariApp e gostaria de saber mais sobre seus serviços para minha festa.\n\nAguardo seu retorno.`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  const SupplierCard = ({ supplier }) => {
    const distance = userLocation && supplier.location 
      ? calculateDistance(userLocation.lat, userLocation.lng, supplier.location.lat, supplier.location.lng)
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`shadow-lg hover:shadow-xl transition-shadow ${supplier.isPremium ? 'ring-2 ring-accent-custom' : ''}`}>
          {supplier.isPremium && (
            <div className="bg-gradient-to-r from-accent-custom to-yellow-500 text-white px-3 py-1 text-xs font-semibold flex items-center">
              <Crown size={12} className="mr-1" />
              FORNECEDOR PREMIUM
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Foto do fornecedor */}
              <div className="flex-shrink-0">
                <img
                  src={supplier.photo}
                  alt={supplier.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              </div>

              {/* Informações principais */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {supplier.name}
                  </h3>
                  {supplier.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="ml-1 text-sm font-medium">{supplier.rating}</span>
                      <span className="ml-1 text-xs text-muted-foreground">({supplier.reviewCount})</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {supplier.description}
                </p>

                {/* Localização e distância */}
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{supplier.location.city}, {supplier.location.state}</span>
                  {distance && (
                    <span className="ml-2 text-primary-custom font-medium">
                      • {distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                {/* Botões de contato */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => openWhatsApp(supplier.whatsapp, supplier.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle size={14} className="mr-1" />
                    WhatsApp
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendEmail(supplier.email, supplier.name)}
                  >
                    <Mail size={14} className="mr-1" />
                    Email
                  </Button>

                  {supplier.instagram && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInstagram(supplier.instagram)}
                      className="text-pink-600 border-pink-600 hover:bg-pink-50"
                    >
                      <Instagram size={14} className="mr-1" />
                      Instagram
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${supplier.phone}`, '_self')}
                  >
                    <Phone size={14} className="mr-1" />
                    Ligar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="text-center">
          <div className="bg-gradient-to-r from-accent-custom to-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Crown className="text-white" size={32} />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Torne-se um Fornecedor Premium</h3>
          
          <p className="text-muted-foreground mb-6">
            Destaque seu negócio e apareça primeiro nos resultados de busca!
          </p>

          <div className="bg-gradient-to-r from-primary-custom to-secondary-custom text-white rounded-lg p-4 mb-6">
            <div className="text-2xl font-bold">R$ 2,99</div>
            <div className="text-sm opacity-90">primeiro mês</div>
            <div className="text-xs opacity-75 mt-1">depois R$ 5,99/mês</div>
          </div>

          <div className="text-left space-y-2 mb-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Aparece primeiro nos resultados</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Selo Premium destacado</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Mais visibilidade para seu negócio</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Estatísticas detalhadas</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPremiumModal(false)}
              className="flex-1"
            >
              Agora não
            </Button>
            <Button
              onClick={() => {
                setShowPremiumModal(false);
                // Aqui integraria com sistema de pagamento
                alert('Redirecionando para pagamento...');
              }}
              className="flex-1 bg-gradient-to-r from-primary-custom to-secondary-custom"
            >
              <CreditCard size={16} className="mr-2" />
              Assinar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const RegisterForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Cadastrar como Fornecedor</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRegisterForm(false)}
          >
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Nome do Negócio"
            placeholder="Ex: Churrascaria do João"
            required
          />
          
          <FormSelect
            label="Tipo de Serviço"
            placeholder="Selecione o tipo"
            options={supplierTypes.filter(type => type.value !== 'all')}
            required
          />

          <FormInput
            label="Descrição"
            placeholder="Descreva seus serviços..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Telefone"
              placeholder="(11) 99999-9999"
              required
            />
            
            <FormInput
              label="Email"
              type="email"
              placeholder="contato@empresa.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="WhatsApp"
              placeholder="5511999999999"
              required
            />
            
            <FormInput
              label="Instagram"
              placeholder="@meuinstagram"
            />
          </div>

          <FormInput
            label="Endereço Completo"
            placeholder="Rua, número, bairro, cidade, estado"
            required
          />

          <FormInput
            label="URL da Foto de Perfil"
            placeholder="https://exemplo.com/foto.jpg"
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Próximos Passos</h4>
            <p className="text-blue-800 text-sm mb-3">
              Após o cadastro, você poderá:
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Receber contatos de clientes interessados</li>
              <li>• Gerenciar seu perfil e informações</li>
              <li>• Upgrade para Premium por apenas R$ 2,99 no primeiro mês</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRegisterForm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowRegisterForm(false);
                setShowPremiumModal(true);
              }}
              className="flex-1 bg-primary-custom hover:bg-primary-custom/90"
            >
              Cadastrar Grátis
            </Button>
          </div>
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
                  Fornecedores
                </h1>
              </div>
            </div>
            
            <Button
              onClick={() => setShowRegisterForm(true)}
              className="bg-white text-primary-custom hover:bg-gray-100"
            >
              <Plus size={20} className="mr-2" />
              Cadastrar-se
            </Button>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            Encontre os melhores fornecedores para sua festa
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 max-w-6xl mx-auto">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <FormInput
                      placeholder="Buscar fornecedores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <FormSelect
                  placeholder="Tipo de serviço"
                  options={supplierTypes}
                  value={selectedType}
                  onValueChange={setSelectedType}
                />

                <div className="flex items-center space-x-2">
                  <Button
                    variant={useGeolocation ? "default" : "outline"}
                    onClick={handleLocationToggle}
                    className="flex-1"
                  >
                    <MapPin size={16} className="mr-2" />
                    {useGeolocation ? 'Próximos' : 'Localização'}
                  </Button>
                </div>
              </div>

              {useGeolocation && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Distância máxima:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">{maxDistance} km</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de fornecedores */}
        <div className="space-y-4 pb-8">
          {filteredSuppliers.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Nenhum fornecedor encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou cadastre-se como fornecedor
                </p>
                <Button
                  onClick={() => setShowRegisterForm(true)}
                  className="bg-primary-custom hover:bg-primary-custom/90"
                >
                  <Plus size={20} className="mr-2" />
                  Cadastrar como Fornecedor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">
                  {filteredSuppliers.length} fornecedor(es) encontrado(s)
                </p>
                {useGeolocation && userLocation && (
                  <Badge variant="secondary">
                    <MapPin size={12} className="mr-1" />
                    Ordenado por proximidade
                  </Badge>
                )}
              </div>

              {filteredSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modais */}
      {showRegisterForm && <RegisterForm />}
      {showPremiumModal && <PremiumModal />}
    </div>
  );
};

export default SuppliersScreen;

