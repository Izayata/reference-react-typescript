import './css/home-page-container.css'
import './css/banner-element-img.css'
import './css/banner-element-container.css'
import './css/banner-element-img-container.css'
import './css/banner-movement-animation.css'
import './css/banner-paragraph-style.css'
import './css/banner-separator.css'
import './css/szezonalis-esemenyunk-container.css'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { sleep } from '../../utils/sleep/SleepUtils'

export function Home() {
  const { t } = useTranslation()
  const [bannerState, setBannerState] = useState<'borstoro-boldizsar' | 'alapanyagaink' | 'honap-kedvence'>('borstoro-boldizsar')

  useEffect(() => {
    const changeBanner = async () => {
      await sleep(30000)
      if (bannerState === 'alapanyagaink') {
        setBannerState('honap-kedvence')
        return
      }
      if (bannerState === 'borstoro-boldizsar') {
        setBannerState('alapanyagaink')
        return
      }
      if (bannerState === 'honap-kedvence') {
        setBannerState('borstoro-boldizsar')
        return
      }
    }

    changeBanner()
  }, [bannerState])

  return (
    <div className='home-page-container'>
      {bannerState === 'borstoro-boldizsar' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'darkkhaki'}}>
          <div className='banner-element-img-container'>
            <img className="banner-element-img" src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg" alt="Source: https://www.pexels.com/photo/man-in-white-dress-shirt-wearing-eyeglasses-3814446/" />
          </div>
          <p className='banner-paragraph-style'>
            {t('home.boldizsarWelcomePart1')}
            <br />
            <br />
            {t('home.boldizsarWelcomePart2')}
          </p>
        </div>
      )}
      {bannerState === 'alapanyagaink' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'burlywood'}}>
          <div className='banner-element-img-container'>
            <img className='banner-element-img' src="https://images.pexels.com/photos/4252142/pexels-photo-4252142.jpeg" alt="Source: https://www.pexels.com/photo/person-slicing-vegetable-on-chopping-board-4252142/" />
          </div>
          <p className='banner-paragraph-style'>
            {t('home.alapanyagaink')}
          </p>
        </div>
        
      )}
      {bannerState === 'honap-kedvence' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'darksalmon'}}>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://gabykonyha.hu/wp-content/uploads/2021/11/Glutenmentes-vegan-sutotokos-gnocchi-16.jpg"
              alt="Source: https://gabykonyha.hu/mindenmentes-foetelek/sutotokos-gnocchi-pestos-gombaval/"
              style={{transform: 'scale(1.5) translateY(-7px)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            {t('home.honapKedvenceOffer')}
          </p>
        </div>
        
      )}
      <div
        className='banner-separator'
      />
      <div
        className='szezonalis-esemenyunk-container'
        style={{backgroundColor: 'tan'}}
      >
        <h3 className='page-title'>{t('home.seasonalThemeTitle')}</h3>
        <div className='banner-element-container gandalf'>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://i.imgur.com/h6ThbK3.gif"
              alt="Source: https://imgur.com/gallery/gandalf-meme-iDFAmpX"
              style={{transform: 'scale(2.4) translateY(-7px)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            {t('home.seasonalThemeParagraph')}
          </p>
        </div>
      </div>
      <div
        className='banner-separator'
      />
      <div
        className='szezonalis-esemenyunk-container'
        style={{backgroundColor: 'peru'}}
      >
        <h3 className='page-title'>{t('home.petFriendlyTitle')}</h3>
        <div className='banner-element-container'>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhZBMVaQr0eh6HV4J_jkNj5Wd7DelB8m5y6rQn1dFrMTOFDpDzPstZGdp08nRnkNNFPaYhOfwWm_M61N-hLE4_Z6yBvHQY2CMjZ137RA"
              alt="Source: https://www.hobbyfarms.com/are-corgis-good-farm-dogs/"
              style={{transform: 'scale(1.5)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            {t('home.petFriendlyPart1')}
            <br />
            <br />
            <span style={{fontStyle: 'italic', textAlign: 'left'}}>
              {t('home.petFriendlyPart2')}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
