import { CSSProperties, useState } from 'react'
import { LoadingIcon } from '../../../functional/LoadingSpinnerIcon/LoadingIcon'
import { sleep } from '../../../../utils/sleep/SleepUtils'

export function MenuItemImage({ src, alt, imageStyle, className }: { src?: string; alt?: string; imageStyle?: CSSProperties; className?: string }) {
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const handleLoad = async () => {
    await sleep(1000)
    setLoading(false)
    setLoaded(true)
  }
  
  const handleError = async () => {
    await sleep(1000)
    setLoading(false)
    setLoaded(false)
  }

  return (
    <>
      {loading && <LoadingIcon />}
      <img
        className={`${className}`}
        src={src}
        alt={alt}
        style={{
          opacity: loading ? 0 : 1,
          display: loading || (!loading && !loaded) ? 'none' : 'block',
          ...imageStyle
        }}
        onLoad={() => handleLoad()}
        onError={() => handleError()}
      />
      {!loading && !loaded && (
        <img src="../fallback-image/kave-avokado.png" alt="fallback-image" />
      )}
    </>
  )
}