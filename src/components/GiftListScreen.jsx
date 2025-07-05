import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '../components/FormComponents';
import { 
  ArrowLeft, 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  ExternalLink,
  Share2,
  Copy,
  Heart,
  Star,
  ShoppingCart
} from 'lucide-react';

const GiftListScreen = ({ onBack }) => {
  const [giftLists, setGiftLists] = useState([
    {
      id: '1',
      name: 'Lista de Aniversário - João 35 anos',
      description: 'Presentes para meu aniversário de 35 anos',
      partyId: '1',
      isPublic: true,
      createdAt: new Date('2024-12-01'),
      gifts: [
        {
          id: '1',
          name: 'Churrasqueira Elétrica',
          description: 'Churrasqueira elétrica portátil para apartamento',
          price: 299.90,
          url: 'https://exemplo.com/churrasqueira',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
          category: 'casa',
          priority: 'alta',
          isReserved: false,
          reservedBy: null,
          reservedAt: null,
        },
        {
          id: '2',
          name: 'Kit de Temperos Gourmet',
          description: 'Kit com 12 temperos especiais para churrasco',
          price: 89.90,
          url: 'https://exemplo.com/temperos',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
          category: 'culinaria',
          priority: 'media',
          isReserved: true,
          reservedBy: 'Maria Silva',
          reservedAt: new Date('2024-12-10'),
        },
        {
          id: '3',
          name: 'Livro de Receitas de Churrasco',
          description: 'Livro com 100 receitas de churrasco e acompanhamentos',
          price: 45.00,
          url: 'https://exemplo.com/livro',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
          category: 'livros',
          priority: 'baixa',
          isReserved: false,
          reservedBy: null,
          reservedAt: null,
        }
      ]
    }
  ]);

  const [selectedList, setSelectedList] = useState(giftLists[0]);
  const [showAddGift, setShowAddGift] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [editingGift, setEditingGift] = useState(null);

  const [newGift, setNewGift] = useState({
    name: '',
    description: '',
    price: '',
    url: '',
    image: '',
    category: 'casa',
    priority: 'media'
  });

  const [newList, setNewList] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  const categories = [
    { label: 'Casa e Decoração', value: 'casa' },
    { label: 'Culinária', value: 'culinaria' },
    { label: 'Livros', value: 'livros' },
    { label: 'Eletrônicos', value: 'eletronicos' },
    { label: 'Roupas e Acessórios', value: 'roupas' },
    { label: 'Esportes e Lazer', value: 'esportes' },
    { label: 'Beleza e Cuidados', value: 'beleza' },
    { label: 'Brinquedos', value: 'brinquedos' },
    { label: 'Outros', value: 'outros' }
  ];

  const priorities = [
    { label: 'Alta', value: 'alta' },
    { label: 'Média', value: 'media' },
    { label: 'Baixa', value: 'baixa' }
  ];

  const addGift = () => {
    if (!newGift.name || !newGift.price) return;

    const gift = {
      ...newGift,
      id: Date.now().toString(),
      price: parseFloat(newGift.price),
      isReserved: false,
      reservedBy: null,
      reservedAt: null
    };

    setSelectedList(prev => ({
      ...prev,
      gifts: [...prev.gifts, gift]
    }));

    setGiftLists(prev => 
      prev.map(list => 
        list.id === selectedList.id 
          ? { ...list, gifts: [...list.gifts, gift] }
          : list
      )
    );

    setNewGift({
      name: '',
      description: '',
      price: '',
      url: '',
      image: '',
      category: 'casa',
      priority: 'media'
    });

    setShowAddGift(false);
  };

  const updateGift = () => {
    if (!editingGift.name || !editingGift.price) return;

    const updatedGift = {
      ...editingGift,
      price: parseFloat(editingGift.price)
    };

    setSelectedList(prev => ({
      ...prev,
      gifts: prev.gifts.map(gift => 
        gift.id === editingGift.id ? updatedGift : gift
      )
    }));

    setGiftLists(prev => 
      prev.map(list => 
        list.id === selectedList.id 
          ? { 
              ...list, 
              gifts: list.gifts.map(gift => 
                gift.id === editingGift.id ? updatedGift : gift
              )
            }
          : list
      )
    );

    setEditingGift(null);
  };

  const deleteGift = (giftId) => {
    setSelectedList(prev => ({
      ...prev,
      gifts: prev.gifts.filter(gift => gift.id !== giftId)
    }));

    setGiftLists(prev => 
      prev.map(list => 
        list.id === selectedList.id 
          ? { ...list, gifts: list.gifts.filter(gift => gift.id !== giftId) }
          : list
      )
    );
  };

  const reserveGift = (giftId, guestName) => {
    const updatedGifts = selectedList.gifts.map(gift => 
      gift.id === giftId 
        ? { 
            ...gift, 
            isReserved: true, 
            reservedBy: guestName, 
            reservedAt: new Date() 
          }
        : gift
    );

    setSelectedList(prev => ({ ...prev, gifts: updatedGifts }));
    setGiftLists(prev => 
      prev.map(list => 
        list.id === selectedList.id 
          ? { ...list, gifts: updatedGifts }
          : list
      )
    );
  };

  const shareList = () => {
    const url = `${window.location.origin}/lista-presentes/${selectedList.id}`;
    navigator.clipboard.writeText(url);
    alert('Link da lista copiado para a área de transferência!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta': return <Star className="fill-current" size={12} />;
      case 'media': return <Star size={12} />;
      case 'baixa': return <Heart size={12} />;
      default: return null;
    }
  };

  const GiftCard = ({ gift }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`shadow-lg hover:shadow-xl transition-shadow ${gift.isReserved ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* Imagem do produto */}
            <div className="flex-shrink-0">
              <img
                src={gift.image || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'}
                alt={gift.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>

            {/* Informações do presente */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {gift.name}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  <Badge className={getPriorityColor(gift.priority)}>
                    {getPriorityIcon(gift.priority)}
                    <span className="ml-1 capitalize">{gift.priority}</span>
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {gift.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary-custom">
                  R$ {gift.price.toFixed(2)}
                </span>
                {gift.isReserved && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check size={12} className="mr-1" />
                    Reservado por {gift.reservedBy}
                  </Badge>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-wrap gap-2">
                {gift.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(gift.url, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Ver Produto
                  </Button>
                )}

                {!gift.isReserved && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const guestName = prompt('Digite seu nome para reservar este presente:');
                      if (guestName) {
                        reserveGift(gift.id, guestName);
                      }
                    }}
                    className="bg-secondary-custom hover:bg-secondary-custom/90"
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    Reservar
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingGift(gift)}
                >
                  <Edit size={14} className="mr-1" />
                  Editar
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteGift(gift.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const AddGiftForm = ({ gift, onSave, onCancel, isEditing = false }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {isEditing ? 'Editar Presente' : 'Adicionar Presente'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Nome do Presente"
            placeholder="Ex: Churrasqueira Elétrica"
            value={gift.name}
            onChange={(e) => isEditing 
              ? setEditingGift(prev => ({ ...prev, name: e.target.value }))
              : setNewGift(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <FormInput
            label="Descrição"
            placeholder="Descreva o presente..."
            value={gift.description}
            onChange={(e) => isEditing 
              ? setEditingGift(prev => ({ ...prev, description: e.target.value }))
              : setNewGift(prev => ({ ...prev, description: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={gift.price}
              onChange={(e) => isEditing 
                ? setEditingGift(prev => ({ ...prev, price: e.target.value }))
                : setNewGift(prev => ({ ...prev, price: e.target.value }))
              }
              required
            />

            <FormSelect
              label="Prioridade"
              options={priorities}
              value={gift.priority}
              onValueChange={(value) => isEditing 
                ? setEditingGift(prev => ({ ...prev, priority: value }))
                : setNewGift(prev => ({ ...prev, priority: value }))
              }
            />
          </div>

          <FormSelect
            label="Categoria"
            options={categories}
            value={gift.category}
            onValueChange={(value) => isEditing 
              ? setEditingGift(prev => ({ ...prev, category: value }))
              : setNewGift(prev => ({ ...prev, category: value }))
            }
          />

          <FormInput
            label="Link do Produto (opcional)"
            placeholder="https://loja.com/produto"
            value={gift.url}
            onChange={(e) => isEditing 
              ? setEditingGift(prev => ({ ...prev, url: e.target.value }))
              : setNewGift(prev => ({ ...prev, url: e.target.value }))
            }
          />

          <FormInput
            label="URL da Imagem (opcional)"
            placeholder="https://exemplo.com/imagem.jpg"
            value={gift.image}
            onChange={(e) => isEditing 
              ? setEditingGift(prev => ({ ...prev, image: e.target.value }))
              : setNewGift(prev => ({ ...prev, image: e.target.value }))
            }
          />

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={onSave} className="flex-1 bg-primary-custom hover:bg-primary-custom/90">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Presente'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary-custom pt-12 pb-6 px-6">
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
                <Gift className="text-white mr-3" size={28} />
                <h1 className="text-white text-2xl font-bold">
                  Lista de Presentes
                </h1>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={shareList}
                className="bg-white text-secondary-custom hover:bg-gray-100"
              >
                <Share2 size={20} className="mr-2" />
                Compartilhar
              </Button>
              <Button
                onClick={() => setShowAddGift(true)}
                className="bg-accent-custom text-white hover:bg-accent-custom/90"
              >
                <Plus size={20} className="mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            {selectedList.name}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-custom">
                    {selectedList.gifts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Presentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedList.gifts.filter(g => g.isReserved).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Reservados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-custom">
                    {selectedList.gifts.filter(g => !g.isReserved).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Disponíveis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-custom">
                    R$ {selectedList.gifts.reduce((sum, gift) => sum + gift.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de presentes */}
        <div className="space-y-4 pb-8">
          {selectedList.gifts.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Gift className="mx-auto text-muted-foreground mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Nenhum presente adicionado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando presentes à sua lista
                </p>
                <Button
                  onClick={() => setShowAddGift(true)}
                  className="bg-primary-custom hover:bg-primary-custom/90"
                >
                  <Plus size={20} className="mr-2" />
                  Adicionar Primeiro Presente
                </Button>
              </CardContent>
            </Card>
          ) : (
            selectedList.gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))
          )}
        </div>
      </div>

      {/* Modais */}
      {showAddGift && (
        <AddGiftForm
          gift={newGift}
          onSave={addGift}
          onCancel={() => setShowAddGift(false)}
        />
      )}

      {editingGift && (
        <AddGiftForm
          gift={editingGift}
          onSave={updateGift}
          onCancel={() => setEditingGift(null)}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default GiftListScreen;

