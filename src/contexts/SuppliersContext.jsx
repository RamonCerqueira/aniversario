import React, { createContext, useContext, useState } from 'react';

const SuppliersContext = createContext();

export const SuppliersProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([
    // Fornecedores de exemplo
    {
      id: '1',
      name: 'Churrascaria do João',
      type: 'churrasco',
      description: 'Especialistas em churrasco para festas e eventos. Mais de 15 anos de experiência.',
      phone: '(11) 99999-1234',
      email: 'joao@churrascaria.com',
      whatsapp: '5511999991234',
      instagram: '@churrascariajao',
      photo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&crop=face',
      location: {
        address: 'Rua das Flores, 123 - São Paulo, SP',
        lat: -23.5505,
        lng: -46.6333,
        city: 'São Paulo',
        state: 'SP'
      },
      rating: 4.8,
      reviewCount: 127,
      isPremium: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Doces da Maria',
      type: 'doces',
      description: 'Doces artesanais para festas infantis e eventos especiais. Brigadeiros, beijinhos e muito mais!',
      phone: '(11) 98888-5678',
      email: 'maria@docesdamaria.com',
      whatsapp: '5511988885678',
      instagram: '@docesdamaria',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616c9c1e8e3?w=400&h=400&fit=crop&crop=face',
      location: {
        address: 'Av. Paulista, 456 - São Paulo, SP',
        lat: -23.5618,
        lng: -46.6565,
        city: 'São Paulo',
        state: 'SP'
      },
      rating: 4.9,
      reviewCount: 89,
      isPremium: false,
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      name: 'DJ Sound Mix',
      type: 'som_dj',
      description: 'Som profissional e DJ para todos os tipos de festa. Equipamentos de última geração.',
      phone: '(11) 97777-9999',
      email: 'contato@djsoundmix.com',
      whatsapp: '5511977779999',
      instagram: '@djsoundmix',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      location: {
        address: 'Rua Augusta, 789 - São Paulo, SP',
        lat: -23.5489,
        lng: -46.6388,
        city: 'São Paulo',
        state: 'SP'
      },
      rating: 4.7,
      reviewCount: 156,
      isPremium: true,
      createdAt: new Date('2024-03-10'),
    },
    {
      id: '4',
      name: 'Decorações Festa Linda',
      type: 'decoracao',
      description: 'Decoração completa para festas infantis e adultos. Temas personalizados e criativos.',
      phone: '(11) 96666-3333',
      email: 'contato@festalinda.com',
      whatsapp: '5511966663333',
      instagram: '@festalinda',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      location: {
        address: 'Rua das Palmeiras, 321 - São Paulo, SP',
        lat: -23.5329,
        lng: -46.6395,
        city: 'São Paulo',
        state: 'SP'
      },
      rating: 4.6,
      reviewCount: 73,
      isPremium: false,
      createdAt: new Date('2024-04-05'),
    }
  ]);

  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const supplierTypes = [
    { label: 'Todos', value: 'all' },
    { label: 'Churrasco', value: 'churrasco' },
    { label: 'Doces e Salgados', value: 'doces' },
    { label: 'Som e DJ', value: 'som_dj' },
    { label: 'Decoração', value: 'decoracao' },
    { label: 'Fotografia', value: 'fotografia' },
    { label: 'Buffet', value: 'buffet' },
    { label: 'Bebidas', value: 'bebidas' },
    { label: 'Animação', value: 'animacao' },
    { label: 'Segurança', value: 'seguranca' },
    { label: 'Limpeza', value: 'limpeza' },
    { label: 'Transporte', value: 'transporte' },
  ];

  const addSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: Date.now().toString(),
      createdAt: new Date(),
      rating: 0,
      reviewCount: 0,
      isPremium: false,
    };

    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (supplierId, supplierData) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, ...supplierData }
          : supplier
      )
    );
  };

  const deleteSupplier = (supplierId) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
  };

  const getSuppliersByType = (type) => {
    if (type === 'all') return suppliers;
    return suppliers.filter(supplier => supplier.type === type);
  };

  const getSuppliersByLocation = (partyLocation, maxDistance = 50) => {
    if (!partyLocation || !partyLocation.lat || !partyLocation.lng) {
      return suppliers;
    }

    return suppliers.filter(supplier => {
      if (!supplier.location || !supplier.location.lat || !supplier.location.lng) {
        return false;
      }

      const distance = calculateDistance(
        partyLocation.lat,
        partyLocation.lng,
        supplier.location.lat,
        supplier.location.lng
      );

      return distance <= maxDistance;
    }).sort((a, b) => {
      const distanceA = calculateDistance(
        partyLocation.lat,
        partyLocation.lng,
        a.location.lat,
        a.location.lng
      );
      const distanceB = calculateDistance(
        partyLocation.lat,
        partyLocation.lng,
        b.location.lat,
        b.location.lng
      );
      return distanceA - distanceB;
    });
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const searchSuppliers = (query, filters = {}) => {
    let filtered = suppliers;

    // Filtro por tipo
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(supplier => supplier.type === filters.type);
    }

    // Filtro por localização
    if (filters.location) {
      filtered = getSuppliersByLocation(filters.location, filters.maxDistance || 50);
    }

    // Filtro por texto
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.description.toLowerCase().includes(searchTerm) ||
        supplier.location.city.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar por premium primeiro, depois por rating
    return filtered.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return b.rating - a.rating;
    });
  };

  const getUserLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocalização não suportada');
      setIsLoading(false);
    }
  };

  const value = {
    suppliers,
    supplierTypes,
    userLocation,
    isLoading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliersByType,
    getSuppliersByLocation,
    searchSuppliers,
    getUserLocation,
    calculateDistance,
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (context === undefined) {
    throw new Error('useSuppliers deve ser usado dentro de um SuppliersProvider');
  }
  return context;
};

