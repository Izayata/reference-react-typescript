import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './OrdersButton.css'

interface OrdersButtonProps {
  className?: string
  style?: React.CSSProperties
}

export function OrdersButton({
  className = 'orders-button-nav-link-wrapper',
  style
}: OrdersButtonProps) {
  const { t } = useTranslation()

  return (
    <NavLink
      to='/orders'
      className={
        ({ isActive }) => (`${className} ${isActive ? 'active' : ''}`)
      }
      style={style}
    >
      {t('nav.myOrders')}
    </NavLink>
  )
}
