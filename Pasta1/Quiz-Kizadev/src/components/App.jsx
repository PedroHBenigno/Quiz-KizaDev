import { useEffect, useState } from 'react'
import './App.css'

function App() {

const [ativo, setAtivo] = useState(() => {
  const salvo = localStorage.getItem('dificuty')
  return salvo !== null ? Number(salvo) : 0 // sempre começa no facil
})

// sempre que muda, vai salvar novo valor localStorage
useEffect(() => {
  localStorage.setItem('dificuty', ativo)
}, [ativo])

  return (
    <main className='flex w-full'>
      <div className='bg-black/40 fixed inset-0 -z-10'></div>
      <div className='flex justify-center items-center flex-col gap-4 quiz-container'>
        <h1 className='name-quiz'>Nome Quiz Aqui</h1>

        <div className='flex flex-col justify-center items-center gap-6'>
          <a href="#" className='options start'>COMEÇAR</a>
          <a href="#" className='options'>OPÇÕES</a>
          <a href="#" className='options'>PLACAR</a>
          <a href="#" className='options exit'>SAIR</a>
        </div>

        <div>
          <div className='flex justify-center items-center flex-col gap-4'>
            <h2 className='text-xl'>Escolha a dificuldade</h2>

            <div className='container-dificuty'>

              <input type='radio' name='dificuty' id='easy' checked={ativo === 0} onChange={() => setAtivo(0)}/>
              <label htmlFor="easy">Fácil</label>

              <input type='radio' name='dificuty' id='medium' checked={ativo === 1} onChange={() => setAtivo(1)}/>
              <label htmlFor="medium">Média</label>

              <input type='radio' name='dificuty' id='hard' checked={ativo === 2} onChange={() => setAtivo(2)}/>
              <label htmlFor="hard">Difícil</label>
            </div>
          </div>
      </div>
      </div>
    </main>
  )
}

export default App