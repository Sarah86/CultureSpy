
import { Mission, Language } from './types';

export const getLocalizedMockMissions = (lang: Language): Mission[] => {
  const content = {
    EN: {
      title: 'The Gallery Ghost',
      desc: 'A sneaky digital ghost is hiding in the art! Use your hero senses to track down all glitches!',
      tasks: [
        { prompt: 'Find the brightest color!', curiosity: 'Did you know? Humans can see over 10 million different colors!' },
        { prompt: 'Spot a hidden animal.', curiosity: 'Artists often hide animals to represent secret symbols or strength!' },
        { prompt: 'Touch a cold wall.', curiosity: 'Stone walls stay cool because they have "thermal mass" which absorbs heat slowly.' },
        { prompt: 'Listen for a secret whisper.', curiosity: 'Sound bounces off hard surfaces like echoes in a cave!' },
        { prompt: 'Count 5 people with glasses.', curiosity: 'Glasses were invented in Italy around the year 1286!' },
        { prompt: 'Spin like a spy!', curiosity: 'Spies use spinning to check their surroundings 360 degrees in one move!' },
        { prompt: 'Find a bored statue.', curiosity: 'Many statues look serious because they were carved to last for thousands of years.' },
        { prompt: 'Find a triangle.', curiosity: 'Triangles are the strongest shape in nature and engineering!' },
        { prompt: 'Feel your spy gear.', curiosity: 'The best espiognage tools are often items that look totally normal!' },
        { prompt: 'High-five a shadow!', curiosity: 'Shadows move exactly as fast as the light that creates them!' }
      ]
    },
    IT: {
      title: 'Il Fantasma della Galleria',
      desc: 'Un fantasma digitale si nasconde nell\'arte! Usa i tuoi sensi eroici per trovare tutti i glitch!',
      tasks: [
        { prompt: 'Trova il colore più luminoso!', curiosity: 'Lo sapevi? Gli esseri umani possono vedere oltre 10 milioni di colori diversi!' },
        { prompt: 'Individua un animale nascosto.', curiosity: 'Gli artisti spesso nascondono animali per rappresentare simboli segreti!' },
        { prompt: 'Tocca un muro freddo.', curiosity: 'I muri di pietra rimangono freschi perché hanno una "massa termica"!' },
        { prompt: 'Ascolta un sussurro segreto.', curiosity: 'Il suono rimbalza sulle superfici dure come l\'eco in una caverna!' },
        { prompt: 'Conta 5 persone con gli occhiali.', curiosity: 'Gli occhiali sono stati inventati in Italia intorno al 1286!' },
        { prompt: 'Gira come una spia!', curiosity: 'Le spie girano su se stesse per controllare l\'ambiente a 360 gradi!' },
        { prompt: 'Trova una statua annoiata.', curiosity: 'Molte statue sembrano serie perché dovevano durare per millenni.' },
        { prompt: 'Trova un triangolo.', curiosity: 'Il triangolo è la forma più forte in natura e nell\'ingegneria!' },
        { prompt: 'Senti il tuo equipaggiamento.', curiosity: 'I migliori strumenti di spionaggio sembrano oggetti normalissimi!' },
        { prompt: 'Dai il cinque a un\'ombra!', curiosity: 'Le ombre si muovono alla stessa velocità della luce!' }
      ]
    },
    FR: {
      title: 'Le Fantôme de la Galerie',
      desc: 'Un fantôme numérique se cache dans l\'art ! Utilisez vos sens de héros pour traquer les anomalies !',
      tasks: [
        { prompt: 'Trouvez la couleur la plus vive !', curiosity: 'Le saviez-vous ? Les humains peuvent voir plus de 10 millions de couleurs !' },
        { prompt: 'Repérez un animal caché.', curiosity: 'Les artistes cachent souvent des animaux pour des symboles secrets.' },
        { prompt: 'Touchez un mur froid.', curiosity: 'La pierre absorbe la chaleur très lentement.' },
        { prompt: 'Écoutez un murmure secret.', curiosity: 'Le son rebondit sur les murs comme un écho.' },
        { prompt: 'Comptez 5 personnes à lunettes.', curiosity: 'Les lunettes ont été inventées en Italie vers 1286 !' },
        { prompt: 'Tournez comme un espion !', curiosity: 'Un espion vérifie tout son environnement en un seul mouvement.' },
        { prompt: 'Trouvez une statue qui s\'ennuie.', curiosity: 'Les statues durent des milliers d\'années.' },
        { prompt: 'Trouvez un triangle.', curiosity: 'Le triangle est la forme plus solide.' },
        { prompt: 'Sentez votre équipement.', curiosity: 'Les meilleurs gadgets d\'espion ressemblent à des objets banals.' },
        { prompt: 'Tapez dans la main d\'une ombre !', curiosity: 'L\'ombre va aussi vite que la lumière.' }
      ]
    },
    PT: {
      title: 'O Fantasma da Galeria',
      desc: 'Um fantasma digital está escondido na arte! Use seus sentidos de herói para rastrear todas as falhas!',
      tasks: [
        { prompt: 'Encontre a cor mais brilhante!', curiosity: 'Você sabia? Os humanos podem ver mais de 10 milhões de cores diferentes!' },
        { prompt: 'Localize um animal escondido.', curiosity: 'Artistas costumam esconder animais para representar símbolos secretos ou força!' },
        { prompt: 'Toque em uma parede fria.', curiosity: 'Paredes de pedra ficam frias porque absorvem o calor muito lentamente.' },
        { prompt: 'Ouça um sussurro secreto.', curiosity: 'O som rebate em superfícies duras como ecos em uma caverna!' },
        { prompt: 'Conte 5 pessoas de óculos.', curiosity: 'Os óculos foram inventados na Itália por volta do ano 1286!' },
        { prompt: 'Gire como um espião!', curiosity: 'Espiões giram para verificar os arredores em 360 graus rapidamente!' },
        { prompt: 'Encontre uma estátua entediada.', curiosity: 'Muitas estátuas parecem sérias porque foram feitas para durar milênios.' },
        { prompt: 'Encontre um triângulo.', curiosity: 'Triângulos são a forma mais forte na natureza e na engenharia!' },
        { prompt: 'Sinta seu equipamento de espião.', curiosity: 'As melhores ferramentas de espionagem parecem objetos totalmente normais!' },
        { prompt: 'Dê um tchau para uma sombra!', curiosity: 'As sombras se movem exatamente na mesma velocidade da luz!' }
      ]
    }
  };

  const c = content[lang];
  
  return [
    {
      id: 'm1',
      codeName: 'OP-CAÇA-AO-GLITCH',
      title: c.title,
      category: 'ART',
      description: c.desc,
      difficulty: 3,
      isLocked: false,
      status: 'PENDING',
      tasks: c.tasks.map((t, i) => ({
        id: `m1t${i}`,
        type: 'observation',
        sensoryType: ['sight', 'sight', 'touch', 'sound', 'sight', 'vibe', 'sight', 'sight', 'touch', 'vibe'][i] as any,
        prompt: t.prompt,
        curiosity: t.curiosity,
        completed: false
      }))
    }
  ];
};
