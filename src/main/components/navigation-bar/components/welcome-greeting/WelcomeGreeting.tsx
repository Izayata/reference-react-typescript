import { useTranslation } from 'react-i18next'
import './WelcomeGreeting.css'

interface WelcomeGreetingProps {
  username: string
}

export function WelcomeGreeting({ username }: WelcomeGreetingProps) {
  const { t } = useTranslation()

  return (
    <span className='welcome-greeting'>
      {t('nav.welcomeGreeting', { username })}
    </span>
  )
}
