import { Checkout } from '../../components/page/Checkout/Checkout'

interface CheckoutPageProps {
  isAuthenticated: boolean
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ isAuthenticated }) => {
  return(
    <Checkout isAuthenticated={isAuthenticated}/>
  )
}