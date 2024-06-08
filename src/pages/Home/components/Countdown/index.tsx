import { useEffect, useContext } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CycleContext'

export function Countdown() {
  const {
    activeCycle,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext)
  const totalCycleSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalCycleSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalCycleSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalCycleSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  const currentCycleSeconds = activeCycle
    ? totalCycleSeconds - amountSecondsPassed
    : 0

  const currentMinutesAmount = Math.floor(currentCycleSeconds / 60)
  const currentSecondsAmount = currentCycleSeconds % 60

  const minutes = String(currentMinutesAmount).padStart(2, '0')
  const seconds = String(currentSecondsAmount).padStart(2, '0')

  useEffect(() => {
    document.title = `${minutes}:${seconds}`
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
