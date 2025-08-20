import React from 'react';
import EventCard from '../components/card/EventCard'; // Ajuste o caminho conforme a sua estrutura de pastas

function Analytics() {
  // 1. Crie o objeto de dados do evento que será passado como prop
  const myEventData = {
    name: 'Campeonato Brasileiro Sub-23',
    confirmedAthletes: [
      { id: 1, name: 'Atleta Confirmado 1' },
      { id: 2, name: 'Atleta Confirmado 2' },
      { id: 3, name: 'Atleta Confirmado 3' },
    ],
    unconfirmedAthletes: [
      { id: 4, name: 'Atleta Não Confirmado 1' },
      { id: 5, name: 'Atleta Não Confirmado 2' },
    ],
  };

  return (
    <div>
      {/* 2. Renderize o EventCard e passe o objeto de dados como a prop 'event' */}
      <EventCard event={myEventData} />
    </div>
  );
}

export default Analytics;
