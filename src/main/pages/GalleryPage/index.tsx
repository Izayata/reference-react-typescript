import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './GalleryPage.css'

export function GalleryPage() {
  const { t } = useTranslation()
  const sliderRef = useRef<HTMLDivElement>(null)
  const imagesUrls: [string, string][] = [
    ['https://i.imgur.com/cTThDqf.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/X3enEL7.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/V0FIX6F.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/vm8Prix.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/MARVAiV.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/hrJBVcY.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/pOSpQDV.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.imgur.com/sJK1ayZ.jpeg', 'AI generated image of my concept of ImagineBar restaurant project'],
    ['https://i.pinimg.com/236x/d8/2e/b8/d82eb8eba6d86bcea11da093b5750f96.jpg', 'Picture of happy shiba puppy held in hands'],
    ['https://i.imgur.com/QmMHKJy.png', 'Buffed Doge VS Cheems meme - Cheems representing my skills before thesis project and Buffed Doge representing my skills with the experience my thesis project gave me'],
  ]

  function navigate(direction: 1 | -1) {
    const slider = sliderRef.current
    if (!slider) return

    const slides = Array.from(slider.children) as HTMLElement[]
    const currentIndex = slides.reduce((closest, slide, index) => (
      Math.abs(slide.offsetLeft - slider.scrollLeft) < Math.abs(slides[closest].offsetLeft - slider.scrollLeft) ? index : closest
    ), 0)
    const nextIndex = (currentIndex + direction + slides.length) % slides.length

    slides[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <section className='gallery-container'>
      <div className='gallery-slider-wrapper'>
        <button
          type='button'
          className='gallery-slider-arrow gallery-slider-arrow-prev'
          onClick={() => navigate(-1)}
          aria-label={t('gallery.previousImageAriaLabel')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className='gallery-slider' ref={sliderRef}>
          {imagesUrls.map(([url, alt], index) => (
            <img
              key={index}
              id={`slide-${index}`}
              src={url}
              alt={alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding='async'
            />
          ))}
        </div>
        <button
          type='button'
          className='gallery-slider-arrow gallery-slider-arrow-next'
          onClick={() => navigate(1)}
          aria-label={t('gallery.nextImageAriaLabel')}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <div className='gallery-slider-nav'>
          {imagesUrls.map((_, index) => (
            <a key={index} href={`#slide-${index}`} aria-label={t('gallery.goToImageAriaLabel', { index: index + 1 })}></a>
          ))}
        </div>
      </div>
    </section>
  )
}