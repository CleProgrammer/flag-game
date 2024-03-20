import { useEffect, useState } from 'react'

import Flags from './flags/flags'

import './App.css'

function App() {
  const c = (cl:any) => document.querySelector(cl)

  const [numFlags, setnumFlags] = useState(1)
  const [flagsNames, setflagsNames] = useState([])
  const [flagPosition, setflagPosition] = useState(0) //80
  const [score, setScore] = useState(0)

  let copyFlags:any = [[], [], []]
  let nameFlagstochoose:any = []
  let IsNextFlag = false

  const nextFlag = (e:any) => {
    IsNextFlag = true

    let allOptions:any = document.querySelectorAll('.section-options div')
    if( e.target.innerHTML === c(`#flag${numFlags.toString()}`).className ) {
      e.target.style.backgroundColor = 'green'
      e.target.style.color = 'white'
    } else {
      e.target.style.backgroundColor = 'red'
      e.target.style.color = 'white'

      for( let i = 2; i >= 0; i-- ) {
        if( allOptions[i].innerHTML === c(`#flag${numFlags.toString()}`).className ) {
          allOptions[i].style.backgroundColor = 'green'
          allOptions[i].style.color = 'white'
        }
      }
    }
    
    setTimeout(() => {
      e.target.style.backgroundColor = 'rgb(26, 26, 26)'
      for( let i = 2; i >= 0; i-- ) {
        allOptions[i].style.backgroundColor = 'rgb(26, 26, 26)'
      }

      c('.game .game-main .section-flag').style.marginLeft = `-${flagPosition}vw`
      if( window.innerWidth <= 480 ) {
        setflagPosition( flagPosition + 160 )
      } else {
        setflagPosition( flagPosition + 80 )
      }

      if( e.target.innerHTML === c(`#flag${numFlags.toString()}`).className ) {
        setScore( score + 1 )
      }

      if( numFlags < 11 ) {
        setnumFlags( numFlags + 1 )
        NameChoose()
      }

      e.target.style.color = 'white'
      IsNextFlag = false
    }, 3000)
  }

  const changeColorOption = (e:any) => {
    if( IsNextFlag === false ) {
      e.target.style.backgroundColor = 'white'
      e.target.style.color = 'black'
    }
  }

  const takeOffColorOption = (e:any) => {
    if( IsNextFlag === false ) {
      e.target.style.backgroundColor = 'rgb(26, 26, 26)'
      e.target.style.color = 'white'
    }
  }


  //Escolher nomes aleatórios além do nome certo
  const NameChoose = () => {
    copyFlags[2] = Flags().nameFlags
    if( c(`#flag${numFlags.toString()}`) ) {

      nameFlagstochoose[0] = c(`#flag${numFlags.toString()}`).className

      let index = copyFlags[2].indexOf(c(`#flag${numFlags.toString()}`).className)
      if( index > -1 ) {
        copyFlags[2].splice( index, 1 )
      }

      let chooseNames2 = Math.floor(Math.random() * copyFlags[2].length)
      nameFlagstochoose[1] = copyFlags[2][chooseNames2]

      let index2 = copyFlags[2].indexOf(copyFlags[2][chooseNames2])
      if( index2 > -1 ) {
        copyFlags[2].splice( index2, 1 )
      }

      let chooseNames3 = Math.floor(Math.random() * copyFlags[2].length)
      nameFlagstochoose[2] = copyFlags[2][chooseNames3]
    }

    for (let i = nameFlagstochoose.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nameFlagstochoose[i], nameFlagstochoose[j]] = [nameFlagstochoose[j], nameFlagstochoose[i]];
    }

    setflagsNames( nameFlagstochoose )
  }

  const closeModal = () => {
    c('.game .end-game').style.display = 'none'
    location.reload()
  }


  //Carregar bandeiras pela primeira vez
  useEffect(() => {
    copyFlags[0] = Flags().flags
    copyFlags[1] = Flags().nameFlags
    copyFlags[2] = Flags().nameFlags
    
    for( let i = 1; i <= 10; i ++ ) {
      let chooseFlag = Math.floor( Math.random() * copyFlags[0].length )
      let newElementIMG = document.createElement('img')
      newElementIMG.src = copyFlags[0][chooseFlag]
      newElementIMG.id = 'flag' + i.toString()
      newElementIMG.className = copyFlags[1][chooseFlag]
      if( c('.game .game-main .section-flag') ) {
        c('.game .game-main .section-flag').appendChild(newElementIMG)
      }

      let index = copyFlags[0].indexOf(copyFlags[0][chooseFlag])
      if( index > -1 ) {
        copyFlags[0].splice( index, 1 )
        copyFlags[1].splice( index, 1 )
      }
    }

    NameChoose()

    if( window.innerWidth <= 480 ) {
      setflagPosition( 160 )
    } else {
      setflagPosition( 80 )
    }

  }, [])

  useEffect(() => {
    if( numFlags > 10 ) {
      if( score < 5 ) {
        c('.game .end-game .end-game-text').innerHTML = `Você acertou ${score}/10. Mas não desista, você pode melhorar!`
      } else if( score >= 5 && score < 8 ) {
        c('.game .end-game .end-game-text').innerHTML = `Você acertou ${score}/10. Você está à caminho da perfeição!`
      } else if( score >= 8 && score <= 9 ) {
        c('.game .end-game .end-game-text').innerHTML = `Você acertou ${score}/10! Parabéns você está quase perfeito(a)!`
      } else if( score === 10 ) {
        c('.game .end-game .end-game-text').innerHTML = `Você acertou ${score}/10! Parabéns você chegou à perfeição!`
      }
      c('.game .end-game').style.display = 'flex'
    }

    NameChoose()
  }, [numFlags, score])

  return (
    <div className='game'>
      <div className='game-main'>
        <div className='num-flags'>{numFlags}/10</div>
        <div className='section-flag'>
          
        </div>
        <div className='section-options'>
          {flagsNames.map((item) =>
            <div onClick={nextFlag} onMouseOver={changeColorOption} onMouseOut={takeOffColorOption}>{item}</div>
          )}
        </div>
      </div>

      <div className='end-game'>
          <div className='end-game-text'></div>
          <button onClick={closeModal}>Jogar Novamente</button>
      </div>
    </div>
  )
}

export default App
