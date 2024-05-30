import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme

// Sobrescrever tipagem
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
