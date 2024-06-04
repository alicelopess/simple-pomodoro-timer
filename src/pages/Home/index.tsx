import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CycleContext'

// Icons
import { HandPalm, Play } from '@phosphor-icons/react'

// Validation Lib
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Styles
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

// Components
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'

// Types
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa!'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interrutCurrentCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: undefined,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const taskContent = watch('task')
  const isSubmitDisabled = !taskContent

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="#">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interrutCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
