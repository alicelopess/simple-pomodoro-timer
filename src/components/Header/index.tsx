import { NavLink } from 'react-router-dom'
import { HeaderWrapper } from './styles'
import { Scroll, Timer } from '@phosphor-icons/react'
import applicationLogo from '../../assets/logo.svg'

export function Header() {
  return (
    <HeaderWrapper>
      <img src={applicationLogo} alt="" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderWrapper>
  )
}
