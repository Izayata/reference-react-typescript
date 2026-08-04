import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchOrderHistory } from '../../../utils/pages/account/accountPageUtils'
import { convertToOrderHistoryModels } from '../../../converter/OrderHistoryModelConverter'
import { OrderHistoryModel } from '../../../model/OrderHistoryModel'
import { addToShoppingCart } from '../../../utils/shoppingCart/ShoppingCartUtils'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { LoadingIcon } from '../../functional/LoadingSpinnerIcon/LoadingIcon'
import { handleErrorMessages } from '../../../utils/ErrorUtils'
import './OrderHistory.css'

export function OrderHistory() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setModalMessage } = useModal()
  const [orders, setOrders] = useState<OrderHistoryModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const raw = await fetchOrderHistory()
        const converted = convertToOrderHistoryModels(raw)
        if (converted.length < raw.length) {
          toast.warn(t('orderHistory.someOrdersUnavailable'))
        }
        setOrders(converted)
      } catch (e: unknown) {
        setModalMessage(handleErrorMessages(e))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReorder = (order: OrderHistoryModel) => {
    order.orderItems.forEach(item => addToShoppingCart(item.foodId, item.quantity))
    toast.success(t('orderHistory.reorderSuccess'))
    navigate('/cart')
  }

  return (
    <div className="order-history-page-container">
      <h1 className="page-title">{t('orderHistory.pageTitle')}</h1>
      <section className="card-container user-profile">
        {loading && <LoadingIcon />}
        {!loading && orders.length === 0 && (
          <p>{t('orderHistory.empty')}</p>
        )}
        {!loading && orders.length > 0 && (
          <div className="order-history-list">
            {orders.map(order => (
              <div key={order.id} className="order-history-entry">
                <div className="order-history-entry-date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('hu-HU')
                    : t('orderHistory.dateUnknown')}
                </div>
                <ul className="order-history-entry-items">
                  {order.orderItems.map((item, index) => (
                    <li key={index}>{item.foodName.value} × {item.quantity}</li>
                  ))}
                </ul>
                <div className="order-history-entry-total">
                  <strong>{t('orderHistory.totalLabel')}</strong> {order.totalCost} {order.totalCostCurrency}
                </div>
                <button
                  type="button"
                  className="application-button-style animated"
                  onClick={() => handleReorder(order)}
                >
                  {t('orderHistory.reorderButton')}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
