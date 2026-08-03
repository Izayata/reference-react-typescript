import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router'
import { MenuPage } from './main/pages/MenuPage'
import { AllergenPage } from './main/pages/AllergenPage'
import { AccountPage } from './main/pages/account'
import { Home } from './main/pages/home'
import { ForgottenPasswordPage } from './main/pages/ForgottenPasswordPage'
import { Nav } from './main/components/navigation-bar/NavigationBar'
import { LoginPage } from './main/pages/LoginPage'
import { RegisterPage } from './main/pages/RegisterPage'
import { Header } from './main/components/header/Header'
import { Footer } from './main/features/footer/Footer'
import { CartPage } from './main/pages/ShoppingCartPage'
import { FoodDetailsPage } from './main/pages/FoodDetailsPage'
import 'react-toastify/dist/ReactToastify.css'
import { CheckoutPage } from './main/pages/CheckoutPage'
import { ToastContainer } from 'react-toastify'
import { LoadingOverlay } from './main/components/functional/LoadingOverlay/LoadingOverlay'
import { AccountRouteGuard } from './main/components/functional/AccountRouteGuard/AccountRouteGuard'
import { sleep } from './main/utils/sleep/SleepUtils'
import { Modal } from './main/components/functional/Modal/Modal'
import { ModalProvider, useModal } from './main/context/ModalMessageContext/ModalMessageContext'
import { ActiveMenuCategoryProvider } from './main/context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import { GalleryPage } from './main/pages/GalleryPage'
import { NotFoundPage } from './main/pages/NotFoundPage'
import { ScrollToTop } from './main/components/functional/ScrollToTop/ScrollToTop'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshValue, setRefreshValue] = useState(false)
  const { modalMessage, setModalMessage } = useModal()

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('shopping_cart')) {
      localStorage.setItem('shopping_cart', JSON.stringify({}))
    }
  }, [])

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await sleep(1000) // Simulate loading delay
        const response = await fetch('/auth-status', {
          credentials: 'include',
        })
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [refreshValue])

  const handleLogout = () => {
    setLoading(true)
    setRefreshValue(!refreshValue)
    navigate('/login')
  }

  const handleLogin = () => {
    setLoading(true)
    setRefreshValue(!refreshValue)
    navigate('/account')
  }

  if(loading) return <LoadingOverlay />

  return (
    <div className="app-container">
      <ScrollToTop />
      {modalMessage && (<Modal message={modalMessage} onClose={() => setModalMessage(null)} />)}
      <ToastContainer autoClose = {2000} />
      <div className='slide-in'>
        <Header />
      </div>
      <div className='slide-in'>
        <Nav isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      </div>
      <main className='main-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu_page' element={<MenuPage />} />
          <Route path='/allergens' element={<AllergenPage />}/>
          <Route path='/register' element={<RegisterPage />}/>
          <Route path='/gallery' element={<GalleryPage />}/>
          <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/forgot-password" element={<ForgottenPasswordPage />} />
          <Route
            path="/account"
            element={
              <AccountRouteGuard isAuthenticated={isAuthenticated}>
                <AccountPage />
              </AccountRouteGuard>
            }
          />
          <Route path="/food/:foodId" element={<FoodDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage isAuthenticated={isAuthenticated}/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ModalProvider>
      <ActiveMenuCategoryProvider>
        <AppContent />
      </ActiveMenuCategoryProvider>
    </ModalProvider>
  )
}

export default App
