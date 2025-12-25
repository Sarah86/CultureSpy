
import { Mission, Language } from './types';

export const getLocalizedMockMissions = (lang: Language): Mission[] => {
  const content = {
    EN: {
      title: 'The Gallery Ghost',
      desc: 'A sneaky digital ghost is hiding in the art! Use your hero senses to track down all 10 glitches!',
      tasks: [
        'Find the brightest color!', 'Spot a hidden animal.', 'Touch a cold wall.', 'Listen for a secret whisper.', 
        'Count 5 people with glasses.', 'Spin like a spy!', 'Find a bored statue.', 'Find a triangle.', 
        'Feel your spy gear.', 'High-five a shadow!'
      ]
    },
    IT: {
      title: 'Il Fantasma della Galleria',
      desc: 'Un fantasma digitale si nasconde nell\'arte! Usa i tuoi sensi eroici per trovare tutti i 10 glitch!',
      tasks: [
        'Trova il colore più luminoso!', 'Individua un animale nascosto.', 'Tocca un muro freddo.', 'Ascolta un sussurro segreto.',
        'Conta 5 persone con gli occhiali.', 'Gira come una spia!', 'Trova una statua annoiata.', 'Trova un triangolo.',
        'Senti il tuo equipaggiamento.', 'Dai il cinque a un\'ombra!'
      ]
    },
    FR: {
      title: 'Le Fantôme de la Galerie',
      desc: 'Un fantôme numérique se cache dans l\'art ! Utilisez vos sens de héros pour traquer les 10 anomalies !',
      tasks: [
        'Trouvez la couleur la plus vive !', 'Repérez un animal caché.', 'Touchez un mur froid.', 'Écoutez un murmure secret.',
        'Comptez 5 personnes à lunettes.', 'Tournez comme un espion !', 'Trouvez une statue qui s\'ennuie.', 'Trouvez un triangle.',
        'Sentez votre équipement.', 'Tapez dans la main d\'une ombre !'
      ]
    },
    PT: {
      title: 'O Fantasma da Galeria',
      desc: 'Um fantasma digital está escondido na arte! Use seus sentidos de herói para rastrear todas as 10 falhas!',
      tasks: [
        'Encontre a cor mais brilhante!', 'Localize um animal escondido.', 'Toque em uma parede fria.', 'Ouça um sussurro secreto.',
        'Conte 5 pessoas de óculos.', 'Gire como um espião!', 'Encontre uma estátua entediada.', 'Encontre um triângulo.',
        'Sinta seu equipamento de espião.', 'Dê um high-five em uma sombra!'
      ]
    }
  };

  const c = content[lang];
  
  return [
    {
      id: 'm1',
      codeName: 'OP-GLITCH-HUNT',
      title: c.title,
      category: 'ART',
      description: c.desc,
      difficulty: 3,
      isLocked: false,
      status: 'PENDING',
      tasks: c.tasks.map((prompt, i) => ({
        id: `m1t${i}`,
        type: 'observation',
        sensoryType: ['sight', 'sight', 'touch', 'sound', 'sight', 'vibe', 'sight', 'sight', 'touch', 'vibe'][i] as any,
        prompt,
        completed: false
      }))
    }
  ];
};
