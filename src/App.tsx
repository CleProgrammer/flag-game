import { useEffect, useState } from 'react'

import Flags from './flags/flags'

import './App.css'

function App() {
  const c = (cl:any) => document.querySelector(cl)

  const [numFlags, setnumFlags] = useState(1)
  const [flagsNames, setflagsNames] = useState([])
  const [flagPosition, setflagPosition] = useState(0) //80
  const [score, setScore] = useState(0)
  const [toDisableMic, setToDisableMic] = useState(false)
  const [toChooseLevel, setToChooseLevel] = useState(false)

  let copyFlags:any = [[], [], []]
  let nameFlagstochoose:any = []
  let IsNextFlag = false

  const openLevel = (e:any) => {
    if( e.target.className === 'normal-level-title' || e.target.className === 'normal-level-description' ) {
      c('.game .game-choose-level').style.display = 'none'
      c('.game .option-normal').style.display = 'flex'
      setToDisableMic( true )
      setToChooseLevel( true )
    } else {
      c('.game .game-choose-level').style.display = 'none'
      c('.game .option-hard').style.display = 'flex'
      setToChooseLevel( true )
      SpeechUser()
    }
  }


  //HARD LEVEL
  //Get Voice
  const SpeechUser = () => {
    if( toDisableMic === false && toChooseLevel === true ) {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new window.SpeechRecognition();

      recognition.lang = 'pt-BR'

      recognition.addEventListener('result', (e:any) => {

        c('.game .option-hard .section-options .name-flag').innerHTML = e.results[0][0].transcript

        console.log( c(`#flag${numFlags.toString()}hard`).className.toLowerCase() )
        if( e.results[0][0].transcript.toLocaleLowerCase() === c(`#flag${numFlags.toString()}hard`).className.toLowerCase() ) {

          c('.game .option-hard .section-options .name-flag').style.backgroundColor = 'green'

          newFlagHardLevel(e.results[0][0].transcript)
        } else {
          c('.game .option-hard .section-options .name-flag').style.backgroundColor = 'red'
          newFlagHardLevel(e.results[0][0].transcript)
        }
      
      })

      recognition.start()
    }
  }


  const newFlagHardLevel = (e:any) => {
    setTimeout(() => {
      c('.game .option-hard .section-options .name-flag').style.backgroundColor = 'rgb(26, 26, 26)'

      c('.game .option-hard .section-flag').style.marginLeft = `-${flagPosition}vw`
      if( window.innerWidth <= 480 ) {
        setflagPosition( flagPosition + 160 )
      } else {
        setflagPosition( flagPosition + 80 )
      }

      if( e.toLocaleLowerCase() === c(`#flag${numFlags.toString()}hard`).className.toLowerCase() ) {
        setScore( score + 1 )
      }

      if( numFlags < 11 ) {
        setnumFlags( numFlags + 1 )
      }

      c('.game .option-hard .section-options .name-flag').innerHTML = ''
      SpeechUser()

      IsNextFlag = false
    }, 3000)
  
  }



  //NORMAL LEVEL
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

      c('.game .option-normal .section-flag').style.marginLeft = `-${flagPosition}vw`
      c('.game .option-hard .section-flag').style.marginLeft = `-${flagPosition}vw`
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
      if( c('.game .option-normal .section-flag') ) {
        c('.game .option-normal .section-flag').appendChild(newElementIMG)
      }

      let index = copyFlags[0].indexOf(copyFlags[0][chooseFlag])
      if( index > -1 ) {
        copyFlags[0].splice( index, 1 )
        copyFlags[1].splice( index, 1 )
      }
    }

    for( let i = 1; i <= 10; i ++ ) {
      let chooseFlag = Math.floor( Math.random() * copyFlags[0].length )
      let newElementIMG = document.createElement('img')
      newElementIMG.src = copyFlags[0][chooseFlag]
      newElementIMG.id = 'flag' + i.toString() + 'hard'
      newElementIMG.className = copyFlags[1][chooseFlag]

      if( c('.game .option-hard .section-flag') ) {
        c('.game .option-hard .section-flag').appendChild(newElementIMG)
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

    //console.log('fdgdfg')
    NameChoose()
  }, [numFlags, score, SpeechUser()])

  return (
    <div className='game'>

      <div className='game-choose-level'>
        <div className='game-title'>QUAL É O PÁIS?</div>
        <div className='normal-level' onClick={openLevel}>
          <div className='normal-level-title'>NORMAL</div>
          <div className='normal-level-description'>Você terá três opções para escolher.</div>
        </div>

        <div className='hard-level' onClick={openLevel}>
          <div className='hard-level-title'>DIFÍCIL</div>
          <div className='hard-level-description'>Você terá que falar qual é o país.</div>
        </div>
      </div>
      
      <div className='option-normal' style={{display: 'none'}}>
        <div className='num-flags'>{numFlags}/10</div>
        <div className='section-flag'>
          
        </div>
        <div className='section-options' style={{justifyContent: 'space-between'}}>
          {flagsNames.map((item) =>
            <div onClick={nextFlag} onMouseOver={changeColorOption} onMouseOut={takeOffColorOption}>{item}</div>
          )}
        </div>
        
      </div>


      <div className='option-hard' style={{display: 'none'}}>
        <div className='num-flags'>{numFlags}/10</div>
        <div className='section-flag'>
          
        </div>
        <div className='section-options' style={{justifyContent: 'center'}}>
          <div className='name-flag'></div>
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
