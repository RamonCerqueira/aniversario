import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '../components/FormComponents';
import { ArrowLeft, Calculator, Users, Clock, Utensils } from 'lucide-react';

const ConsumptionScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    partyType: '',
    guestCount: '',
    duration: '4',
    hasChildren: 'false',
    childrenCount: '',
    drinkPreference: 'misto',
  });

  const [results, setResults] = useState(null);

  const partyTypes = [
    { label: 'Churrasco', value: 'churrasco' },
    { label: 'Festa Infantil', value: 'festa_infantil' },
    { label: 'Festa de Adulto', value: 'festa_adulto' },
    { label: 'Festa Corporativa', value: 'corporativa' },
    { label: 'Confraternização', value: 'confraternizacao' },
  ];

  const durations = [
    { label: '2 horas', value: '2' },
    { label: '3 horas', value: '3' },
    { label: '4 horas', value: '4' },
    { label: '5 horas', value: '5' },
    { label: '6 horas', value: '6' },
    { label: '8 horas', value: '8' },
  ];

  const drinkOptions = [
    { label: 'Só bebidas alcoólicas', value: 'alcoolicas' },
    { label: 'Só bebidas não alcoólicas', value: 'nao_alcoolicas' },
    { label: 'Misto (alcoólicas e não alcoólicas)', value: 'misto' },
  ];

  const calculateConsumption = () => {
    const guests = Math.max(0, parseInt(formData.guestCount || "0"));
    const children = formData.hasChildren === 'true'
      ? Math.min(parseInt(formData.childrenCount || "0"), guests)
      : 0;
    const adults = Math.max(0, guests - children);
    const duration = Math.max(1, parseInt(formData.duration || "4")); // duração mínima de 1h
  
    let calculations = {};
  
    if (formData.partyType === 'churrasco') {
      const carnes = {
        bovinas: adults * 200 + children * 100,
        suinas: adults * 150 + children * 75,
        aves: adults * 150 + children * 100,
        linguicas: adults * 100 + children * 50,
      };
      carnes.total = carnes.bovinas + carnes.suinas + carnes.aves + carnes.linguicas;
  
      calculations = {
        carnes,
        acompanhamentos: {
          arroz: Math.ceil((adults * 80 + children * 60) / 1000 * 10) / 10, // kg
          farofa: Math.ceil((adults * 60 + children * 40) / 1000 * 10) / 10, // kg
          vinagrete: Math.ceil((adults * 50 + children * 30) / 1000 * 10) / 10, // kg
          pao_alho: Math.ceil(adults * 2 + children * 1), // unidades
          queijo_coalho: adults * 80 + children * 30, // gramas
        },
        bebidas: calculateDrinks(adults, children, duration),
        carvao: Math.ceil(carnes.total / 1000), // 1kg de carvão por kg de carne
        gelo: Math.ceil(guests * (duration / 4) * 0.5), // kg
      };
  
    } else if (formData.partyType === 'festa_infantil') {
      calculations = {
        doces: {
          brigadeiros: children * 3 + adults * 2,
          beijinhos: children * 2 + adults * 1,
          docinhos_variados: children * 4 + adults * 2,
          bolo: Math.ceil(guests / 10), // fatias
        },
        salgados: {
          coxinhas: children * 4 + adults * 3,
          risoles: children * 3 + adults * 2,
          pasteis: children * 3 + adults * 2,
          mini_sanduiches: children * 2 + adults * 1,
        },
        bebidas: {
          refrigerante: Math.ceil(guests * 0.5),
          suco: Math.ceil(guests * 0.3),
          agua: Math.ceil(guests * 0.2),
        },
        decoracao: {
          baloes: guests * 3,
          pratinhos: guests + 5,
          copinhos: guests + 5,
          guardanapos: guests * 3,
        }
      };
  
    } else {
      calculations = {
        comidas: {
          salgados_variados: guests * 8,
          doces_variados: guests * 4,
          sanduiches: Math.ceil(guests * 0.5),
        },
        bebidas: calculateDrinks(adults, children, duration),
        utensilios: {
          pratos: guests + 5,
          copos: guests * 2,
          talheres: guests + 5,
          guardanapos: guests * 3,
        }
      };
    }
  
    setResults(calculations);
  };
  
  const calculateDrinks = (adults, children, duration) => {
    const factor = duration / 4; // fator baseado em 4 horas padrão
    
    if (formData.drinkPreference === 'alcoolicas') {
      return {
        cerveja: Math.ceil(adults * 3 * factor), // latas
        vinho: Math.ceil(adults * 0.2 * factor), // garrafas
        destilados: Math.ceil(adults * 0.1 * factor), // garrafas
        refrigerante: Math.ceil(children * 0.5 * factor), // litros
        agua: Math.ceil((adults + children) * 0.3 * factor), // litros
      };
    } else if (formData.drinkPreference === 'nao_alcoolicas') {
      return {
        refrigerante: Math.ceil((adults + children) * 0.6 * factor), // litros
        suco: Math.ceil((adults + children) * 0.4 * factor), // litros
        agua: Math.ceil((adults + children) * 0.5 * factor), // litros
      };
    } else {
      return {
        cerveja: Math.ceil(adults * 2 * factor), // latas
        vinho: Math.ceil(adults * 0.15 * factor), // garrafas
        refrigerante: Math.ceil((adults + children) * 0.4 * factor), // litros
        suco: Math.ceil((adults + children) * 0.3 * factor), // litros
        agua: Math.ceil((adults + children) * 0.4 * factor), // litros
      };
    }
  };

  const isFormValid = () => {
    return formData.partyType && formData.guestCount && 
           parseInt(formData.guestCount) > 0 &&
           (formData.hasChildren === 'false' || 
            (formData.hasChildren === 'true' && formData.childrenCount && 
             parseInt(formData.childrenCount) < parseInt(formData.guestCount)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary-custom pt-12 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
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
              <Calculator className="text-white mr-3" size={28} />
              <h1 className="text-white text-2xl font-bold">
                Churrascômetro
              </h1>
            </div>
          </div>
          <p className="text-white/90 mt-2 ml-12">
            Calcule a quantidade ideal de comida e bebida para sua festa
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2" size={20} />
                  Dados da Festa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormSelect
                  label="Tipo de Festa"
                  placeholder="Selecione o tipo"
                  options={partyTypes}
                  value={formData.partyType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, partyType: value }))}
                  required
                />

                <FormInput
                  label="Número Total de Convidados"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.guestCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                  required
                />

                <FormSelect
                  label="Duração da Festa"
                  placeholder="Selecione a duração"
                  options={durations}
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                />

                <FormSelect
                  label="Haverá crianças?"
                  placeholder="Selecione"
                  options={[
                    { label: 'Não', value: 'false' },
                    { label: 'Sim', value: 'true' },
                  ]}
                  value={formData.hasChildren}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hasChildren: value }))}
                />

                {formData.hasChildren === 'true' && (
                  <FormInput
                    label="Quantas crianças?"
                    type="number"
                    placeholder="Ex: 8"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, childrenCount: e.target.value }))}
                  />
                )}

                <FormSelect
                  label="Preferência de Bebidas"
                  placeholder="Selecione"
                  options={drinkOptions}
                  value={formData.drinkPreference}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, drinkPreference: value }))}
                />

                <Button
                  onClick={calculateConsumption}
                  disabled={!isFormValid()}
                  className="w-full bg-secondary-custom hover:bg-secondary-custom/90"
                >
                  <Calculator className="mr-2" size={20} />
                  Calcular Consumo
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultados */}
          {results && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {formData.partyType === 'churrasco' && (
                <>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-primary-custom">🥩 Carnes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Carnes bovinas:</span>
                          <span className="font-semibold">{(results.carnes.bovinas / 1000).toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carnes suínas:</span>
                          <span className="font-semibold">{(results.carnes.suinas / 1000).toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aves:</span>
                          <span className="font-semibold">{(results.carnes.aves / 1000).toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Linguiças:</span>
                          <span className="font-semibold">{(results.carnes.linguicas / 1000).toFixed(1)} kg</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>{(results.carnes.total / 1000).toFixed(1)} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-accent-custom">🍚 Acompanhamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Arroz:</span>
                          <span className="font-semibold">{results.acompanhamentos.arroz} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Farofa:</span>
                          <span className="font-semibold">{results.acompanhamentos.farofa} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vinagrete:</span>
                          <span className="font-semibold">{results.acompanhamentos.vinagrete} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pão de alho:</span>
                          <span className="font-semibold">{results.acompanhamentos.pao_alho} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Queijo coalho:</span>
                          <span className="font-semibold">{(results.acompanhamentos.queijo_coalho / 1000).toFixed(1)} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-secondary-custom">🍺 Bebidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {results.bebidas.cerveja && (
                          <div className="flex justify-between">
                            <span>Cerveja:</span>
                            <span className="font-semibold">{results.bebidas.cerveja} latas</span>
                          </div>
                        )}
                        {results.bebidas.vinho && (
                          <div className="flex justify-between">
                            <span>Vinho:</span>
                            <span className="font-semibold">{results.bebidas.vinho} garrafas</span>
                          </div>
                        )}
                        {results.bebidas.refrigerante && (
                          <div className="flex justify-between">
                            <span>Refrigerante:</span>
                            <span className="font-semibold">{results.bebidas.refrigerante} litros</span>
                          </div>
                        )}
                        {results.bebidas.suco && (
                          <div className="flex justify-between">
                            <span>Suco:</span>
                            <span className="font-semibold">{results.bebidas.suco} litros</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Água:</span>
                          <span className="font-semibold">{results.bebidas.agua} litros</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>🔥 Extras</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Carvão:</span>
                          <span className="font-semibold">{results.carvao} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gelo:</span>
                          <span className="font-semibold">{results.gelo} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {formData.partyType === 'festa_infantil' && (
                <>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-accent-custom">🍭 Doces</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Brigadeiros:</span>
                          <span className="font-semibold">{results.doces.brigadeiros} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Beijinhos:</span>
                          <span className="font-semibold">{results.doces.beijinhos} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Docinhos variados:</span>
                          <span className="font-semibold">{results.doces.docinhos_variados} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fatias de bolo:</span>
                          <span className="font-semibold">{results.doces.bolo} fatias</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-primary-custom">🥟 Salgados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Coxinhas:</span>
                          <span className="font-semibold">{results.salgados.coxinhas} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risoles:</span>
                          <span className="font-semibold">{results.salgados.risoles} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pastéis:</span>
                          <span className="font-semibold">{results.salgados.pasteis} unidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mini sanduíches:</span>
                          <span className="font-semibold">{results.salgados.mini_sanduiches} unidades</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Dica final */}
              <Card className="shadow-lg border-l-4 border-l-primary-custom">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="bg-primary-custom/10 rounded-full p-2 mr-3">
                      <Users className="text-primary-custom" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">💡 Dica Importante</h4>
                      <p className="text-muted-foreground text-sm">
                        Estes cálculos são estimativas baseadas no consumo médio. 
                        Considere o perfil dos seus convidados e ajuste as quantidades conforme necessário.
                        É sempre melhor ter um pouco a mais do que faltar!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumptionScreen;

