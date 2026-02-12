import { useEffect, useState } from 'react'
import './App.css'

const difficultyMap = {
  0: 'easy',
  1: 'medium',
  2: 'hard'
};

function App() {


  const [ativo, setAtivo] = useState(() => {
    const salvo = localStorage.getItem('difficulty')
    return salvo !== null ? Number(salvo) : 0
  })


  const [perguntas, setPerguntas] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinalizado, setQuizFinalizado] = useState(false);

  useEffect(() => {
    localStorage.setItem('difficulty', ativo)
  }, [ativo])

  const embaralhar = (array) => {
    return [...array].sort(() => Math.random() - 0.5)
  };

  const startGame = async () => {
    setLoading(true);
    const dificuldadeTexto = difficultyMap[ativo];

    try {

   
      const tokenResponse = await fetch(
        "https://tryvia.ptr.red/api_token.php?command=request"
      );
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const url = `https://tryvia.ptr.red/api.php?amount=10&category=9&difficulty=${dificuldadeTexto}&type=multiple&token=${token}`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      const perguntasFormatadas = dados.results.map(q => ({
        ...q,
        options: embaralhar([...q.incorrect_answers, q.correct_answer])
      }));

      setPerguntas(perguntasFormatadas);
      setIndiceAtivo(0);
      setScore(0);
      setQuizFinalizado(false);
      setGameStarted(true);

    } catch (erro) {
      console.error("Erro ao carregar:", erro);
      alert("Erro ao conectar com a API!");
    } finally {
      setLoading(false);
    }
  }

  const conferirResposta = (selecionada) => {
    if (selecionada === perguntas[indiceAtivo].correct_answer) {
      setScore(prev => prev + 1);
    }

    const proxima = indiceAtivo + 1;

    if (proxima < perguntas.length) {
      setIndiceAtivo(proxima);
    } else {
      setQuizFinalizado(true);
    }
  }

  const reiniciarJogo = () => {
    setGameStarted(false);
    setQuizFinalizado(false);
  }

  return (
    <main className='flex w-full min-h-screen items-center justify-center'>
      <div className='bg-black/40 fixed inset-0 -z-10'></div>

      {/* TELA DE CARREGAMENTO */}
      {loading && (
        <div className='quiz-container text-center'>
          <h1 className='name-quiz animate-pulse'>CARREGANDO...</h1>
        </div>
      )}

      {/* RESULTADO FINAL */}
      {!loading && gameStarted && quizFinalizado && (
        <div className='flex justify-center items-center flex-col gap-6 quiz-container'>
          <h1 className='name-quiz'>FIM DE JOGO!</h1>
          <p className='text-2xl'>Você acertou:</p>
          <span className='text-5xl font-bold text-green-400'>
            {score} / 10
          </span>
          <button onClick={reiniciarJogo} className='options start'>
            VOLTAR AO MENU
          </button>
        </div>
      )}

      {/* TELA DE PERGUNTAS */}
      {!loading && gameStarted && !quizFinalizado && (
        <div className='flex justify-center items-center flex-col gap-4 quiz-container'>
          <div className='flex justify-between w-full text-sm opacity-70'>
            <span>Questão {indiceAtivo + 1}/10</span>
            <span>Score: {score}</span>
          </div>

          <h2
            className='text-lg text-center font-semibold mt-2'
            dangerouslySetInnerHTML={{
              __html: perguntas[indiceAtivo]?.question
            }}
          />

          <div className='flex flex-col gap-3 w-full mt-4'>
            {perguntas[indiceAtivo]?.options.map((opcao, i) => (
              <button
                key={i}
                className='options'
                onClick={() => conferirResposta(opcao)}
                dangerouslySetInnerHTML={{ __html: opcao }}
              />
            ))}
          </div>

          <button
            onClick={reiniciarJogo}
            className='options exit mt-4'
          >
            DESISTIR
          </button>
        </div>
      )}

      {/* MENU PRINCIPAL */}
      {!loading && !gameStarted && (
        <div className='flex justify-center items-center flex-col gap-4 quiz-container'>
          <h1 className='name-quiz'>Quiz</h1>

          <div className='flex flex-col justify-center items-center gap-6'>
            <button onClick={startGame} className='options start'>
              COMEÇAR
            </button>
            <a href="#" className='options'>PLACAR</a>
            <button className='options exit'>SAIR</button>
          </div>

          <div className='flex justify-center items-center flex-col gap-4 mt-4'>
            <h2 className='text-xl'>Escolha a dificuldade</h2>
            <div className='container-dificuty'>

              <input
                type='radio'
                name='difficulty'
                id='easy'
                checked={ativo === 0}
                onChange={() => setAtivo(0)}
              />
              <label htmlFor="easy">Fácil</label>

              <input
                type='radio'
                name='difficulty'
                id='medium'
                checked={ativo === 1}
                onChange={() => setAtivo(1)}
              />
              <label htmlFor="medium">Média</label>

              <input
                type='radio'
                name='difficulty'
                id='hard'
                checked={ativo === 2}
                onChange={() => setAtivo(2)}
              />
              <label htmlFor="hard">Difícil</label>

            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
