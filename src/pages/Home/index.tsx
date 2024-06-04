import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

// Validation Lib
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

// Icons
import { Play } from '@phosphor-icons/react'

// Styles
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa!'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// Types
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: undefined,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  const totalCycleSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
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

  const taskContent = watch('task')
  const isSubmitDisabled = !taskContent

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="#">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            // onChange={(e) => setTask(e.target.value)}
            // value={task}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
