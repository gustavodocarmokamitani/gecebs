import { useState, useEffect, useCallback } from 'react'; // 👈 Importe useCallback

const usePhoneInput = (initialValue = '') => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [phoneError, setPhoneError] = useState('');

  // Regex para validar o formato de telefone (00) 00000-0000
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

  const handlePhoneChange = useCallback((e) => {
    // 👈 Use useCallback aqui
    let input = e.target.value;

    // Remove todos os caracteres que não sejam dígitos
    input = input.replace(/\D/g, '');

    // Limita o número de dígitos a 11 (2 para DDD + 9 para o número)
    if (input.length > 11) {
      input = input.substring(0, 11);
    }

    // Aplica a formatação (00) 00000-0000
    if (input.length > 2 && input.length <= 7) {
      input = `(${input.substring(0, 2)}) ${input.substring(2, 7)}`;
    } else if (input.length > 7) {
      input = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7, 11)}`;
    }

    setPhoneNumber(input);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        setPhoneError('Formato de telefone inválido. Use (00) 00000-0000.');
      } else {
        setPhoneError('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [phoneNumber]);

  return { phoneNumber, phoneError, handlePhoneChange };
};

export default usePhoneInput;
