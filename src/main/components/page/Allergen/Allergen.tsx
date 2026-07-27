import { useEffect, useState } from 'react'
import { AllergenModel } from '../../../model/food/AllergenModel'
import { fetchAllergens } from '../../../utils/food/AllergenUtils'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn } from '@fortawesome/free-solid-svg-icons'
import { faShrimp } from '@fortawesome/free-solid-svg-icons'
import { faEgg } from '@fortawesome/free-solid-svg-icons'
import { faFish } from '@fortawesome/free-solid-svg-icons'
import { faPlateWheat } from '@fortawesome/free-solid-svg-icons'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { faJar } from '@fortawesome/free-solid-svg-icons'
import { faBowlRice } from '@fortawesome/free-solid-svg-icons'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import { faHotdog } from '@fortawesome/free-solid-svg-icons'
import { faLeaf } from '@fortawesome/free-solid-svg-icons'
import { faVolcano } from '@fortawesome/free-solid-svg-icons'
import { faPlantWilt } from '@fortawesome/free-solid-svg-icons'
import { faMound } from '@fortawesome/free-solid-svg-icons'


import '../../../css/shared/form/form-container.css'
import './css/allergen-cards-container.css'
import './css/allergen-details-container.css'
import './css/allergen-icon.css'
import './css/allergen-name.css'
import './css/allergen-page-title.css'
import './css/allergen-section.css'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export function Allergen() {
  const [allergens, setAllergens] = useState<AllergenModel[]>([])
  const [loading, setLoading] = useState(true)
  const { setModalMessage } = useModal()

  useEffect(() => {
    fetchAllergens()
      .then(setAllergens)
      .catch(e => setModalMessage(e.message))
      .finally(() => {setLoading(false)})
  }, [])

  const iconMap: { [key: string]: IconProp } = {
    'faWheatAwn': faWheatAwn,
    'faShrimp': faShrimp,
    'faEgg': faEgg,
    'faFish': faFish,
    'faPlateWheat': faPlateWheat,
    'faSeedling': faSeedling,
    'faJar': faJar,
    'faBowlRice': faBowlRice,
    'faCarrot': faCarrot,
    'faHotdog': faHotdog,
    'faLeaf': faLeaf,
    'faVolcano': faVolcano,
    'faPlantWilt': faPlantWilt,
    'faMound': faMound
  }

  function sortIntoSectionOfFour(array: AllergenModel[]) {
    const result = []
    for (let i = 0; i < array.length; i += 4) {
      result.push(array.slice(i, i + 4))
    }
    return result
  }

  //longest name 41 characters long

  function renderSectionOfFour(array: AllergenModel[]) {
    return(      
      <section className='allergen-section'>
        {array.map(a => (
          <div
            key={a.id}
            className='allergen-details-container'
            style={{
              backgroundColor: a.id % 2 === 0 ? '#61574b' : '#8c7851',
              color: a.id % 2 === 0 ? '#f5f5f5e3' : 'black'
            }}
          >
            <FontAwesomeIcon
              icon={iconMap[a.iconName]}
              className='allergen-icon'
            />
            <div
              style={{
                width: '100%',
                border: '1px solid',
                borderRadius: '5px',
                borderColor: a.id % 2 === 0 ? '#8c7851' : '#695A3D'
              }}/>
            <span className='allergen-name'>{a.name.value}</span>
          </div>
        ))}
      </section>
    )
  }


  if (loading) return <LoadingOverlay />
  // <FontAwesomeIcon icon={faWheatAwnCircleExclamation} />

  return (
    <div className='allergen-cards-container'>
      <h2 className='page-title'>Allergének</h2>
      {sortIntoSectionOfFour(allergens).map((section, index) => (
        <div key={index}>
          {renderSectionOfFour(section)}
        </div>
      ))}
    </div>
  )
}
