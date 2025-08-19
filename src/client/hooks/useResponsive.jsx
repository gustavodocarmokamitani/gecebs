import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 600,
  tablet: 960,
};

export const useResponsive = () => {
  const [deviceType, setDeviceType] = useState(null);

  useEffect(() => {
    // Função para determinar o tipo de dispositivo
    const handleResize = () => {
      if (window.innerWidth < breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (
        window.innerWidth >= breakpoints.mobile &&
        window.innerWidth < breakpoints.tablet
      ) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Define o tipo de dispositivo na montagem do componente
    handleResize();

    // Adiciona o event listener para redimensionamento
    window.addEventListener('resize', handleResize);

    // Função de limpeza para remover o event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // O array vazio garante que o efeito seja executado apenas uma vez

  return deviceType;
};
