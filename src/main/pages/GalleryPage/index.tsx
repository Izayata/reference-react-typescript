import './css/gallery-container.css'
import './css/gallery-slider.css'
import './css/gallery-slider-nav.css'
import './css/gallery-slider-wrapper.css'

export function GalleryPage() {
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

  return (
    <section className='gallery-container'>
      <div className='gallery-slider-wrapper'>
        <div className='gallery-slider'>
          {imagesUrls.map(([url, alt], index) => (
            <img
              key={index}
              id={`slide-${index}`}
              src={url}
              alt={alt}
            />
          ))}
        </div>
        <div className='gallery-slider-nav'>
          {imagesUrls.map((_, index) => (
            <a key={index} href={`#slide-${index}`} aria-label={`Ugrás a ${index + 1}. képre`}></a>
          ))}
        </div>
      </div>
    </section>
  )
}