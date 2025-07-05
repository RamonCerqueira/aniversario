import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FormInput, FormButton } from '../components/FormComponents';
import { useAuth } from '../contexts/AuthContext';
import { Gift, Mail, User, Calendar } from 'lucide-react';

const LoginScreen = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'Data de aniversário é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        birthDate: new Date(formData.birthDate),
      };

      await login(user);
      onLoginSuccess();
    } catch (error) {
      alert('Falha ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              delay: 0.2,
              damping: 15,
              stiffness: 150 
            }}
            className="w-24 h-24 bg-primary-custom rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Gift size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AniversariApp
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            Organize sua festa de aniversário perfeita
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <FormInput
                  label="Nome completo"
                  type="text"
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={errors.name}
                  required
                />

                <FormInput
                  label="E-mail"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  error={errors.email}
                  required
                />

                <FormInput
                  label="Data de aniversário"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  error={errors.birthDate}
                  required
                />

                <FormButton
                  type="submit"
                  loading={isLoading}
                  className="w-full mt-6"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </FormButton>
              </form>

              {/* Social Login Placeholder */}
              <div className="mt-6">
                <p className="text-center text-muted-foreground mb-4">
                  Ou entre com
                </p>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-card border border-border rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#DB4437" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-card border border-border rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-card border border-border rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;

