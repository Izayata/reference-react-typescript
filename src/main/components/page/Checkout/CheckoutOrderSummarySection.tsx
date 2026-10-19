import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCartItemModel } from '../../../model/ShoppingCartItemModel'
import '../../../css/shared/separator-hr.css'
import { SectionHeading } from '../../section-heading/SectionHeading'

interface CheckoutOrderSummarySectionProps {
  foods: ShoppingCartItemModel[]
  quantities: { [key: string]: number }
  isCashPayment: boolean
  isCardPayment: boolean
  onSetPaymentToCash: () => void
  onSetPaymentToCard: () => void
  onSubmitOrder: () => void
}

export function CheckoutOrderSummarySection({
  foods,
  quantities,
  isCashPayment,
  isCardPayment,
  onSetPaymentToCash,
  onSetPaymentToCard,
  onSubmitOrder
}: CheckoutOrderSummarySectionProps) {
  const { t } = useTranslation()
  const orderTotal = foods.reduce(
    (total, food) => total + Number(food.price.amount) * Number(quantities[food.foodId]),
    0
  )

  return (
    <section className='form-container checkout-page order-summary'>
      <>
        <SectionHeading className='checkout-section-title'>{t('checkout.itemsTitle')}</SectionHeading>
        <div>
          {foods.map(food => {
            const itemTotal = Number(food.price.amount) * Number(quantities[food.foodId])
            return (
              <div key={food.foodId} className='checkout-order-item-list-container'>
                <div>
                  ×{quantities[food.foodId]} | {food.foodName.value}
                </div>
                <div className='checkout-order-item-price-container'>{itemTotal.toFixed(0)} {t('menu.currencySuffix')}</div>
              </div>
            )
          })}
          <div
            style={{
              width: 'calc(100% - 2rem)',
              border: '.5px solid',
              borderRadius: '5px',
              borderColor: '#695A3D',
              position: 'absolute',
              left: '0',
              right: '0',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </div>
        <div className='checkout-order-price-container'>
          <strong>
            {t('checkout.totalDue')}
          </strong>
          <strong>{orderTotal} {t('menu.currencySuffix')}</strong>
        </div>
        <div className='content-separator' />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {t('checkout.paymentMethodPrompt')}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type='checkbox'
                checked={isCashPayment}
                onChange={onSetPaymentToCash}
              />
              {t('checkout.cashPayment')}
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type='checkbox'
                checked={isCardPayment}
                onChange={onSetPaymentToCard}
              />
              {t('checkout.cardPayment')}
            </label>
          </div>
        </div>
      </>
      <section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <NavLink
          className='application-button-style animated'
          to='/cart'
          style={{ textDecoration: 'none' }}
        >
          {t('checkout.cartButton')}
        </NavLink>
        <button type='button' className='application-button-style animated' onClick={onSubmitOrder}>
          {t('checkout.orderButton')}
        </button>
      </section>
    </section>
  )
}
