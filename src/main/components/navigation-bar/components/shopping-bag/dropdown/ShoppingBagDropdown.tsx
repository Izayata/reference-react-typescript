import { NavLink } from 'react-router-dom'
import '../../../../../css/container/navigation-link-container.css'
import './css/shopping-bag-dropdown.css'
import '../../../../../css/shared/navigation-link.css'

export function ShoppingBagDropdown({ onClick }: { onClick: () => void }) {
  return (
    <div className='shopping-bag-dropdown navigation-link-container' onClick={onClick}>
      <NavLink className='navigation-link shopping-bag-link' to='/cart'>Kosár</NavLink>
      <div style={{
        width: '100%',
        border: '1px solid #695A3D'
      }}/>
      <NavLink className='navigation-link shopping-bag-link' to='/checkout'>Pénztár</NavLink>
    </div>
  )
}