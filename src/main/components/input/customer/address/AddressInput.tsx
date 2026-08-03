import { useState } from 'react'
import { ZipInput } from './ZipInput/ZipInput'
import { CityInput } from './CityInput/CityInput'
import { StreetNameInput } from './StreetNameInput/StreetNameInput'
import { StreetTypeInput } from './StreetTypeInput/StreetTypeInput'
import { StreetNumberInput } from './StreetNumberInput/StreetNumberInput'
import { FloorInput } from './FloorInput/FloorInput'
import { DoorInput } from './DoorInput/DoorInput'
import './AddressInput.css'
import { useLocation } from 'react-router-dom'
import { useZipCityAutofill } from './useZipCityAutofill'
import {
  combineStreetNameAndType,
  splitStreetIntoNameAndType,
  combineFloorAndDoor,
  splitFloorDoorIntoFloorAndDoor
} from '../../../../utils/customer/address/AddressSplitUtils'

export interface AddressInputProps {
  formData: {
    zip: string
    city: string
    street: string
    streetNumber: string
    floorDoor: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AddressInput({ formData, onChange }: AddressInputProps) {
  const location = useLocation()
  useZipCityAutofill(formData.zip, onChange)

  const [{ streetName, streetType }, setStreetParts] = useState(() => splitStreetIntoNameAndType(formData.street))
  const [{ floor, door }, setFloorDoorParts] = useState(() => splitFloorDoorIntoFloorAndDoor(formData.floorDoor))

  const emitStreetChange = (nextStreetName: string, nextStreetType: string) => {
    setStreetParts({ streetName: nextStreetName, streetType: nextStreetType })
    onChange({ target: { name: 'street', value: combineStreetNameAndType(nextStreetName, nextStreetType) } } as React.ChangeEvent<HTMLInputElement>)
  }

  const emitFloorDoorChange = (nextFloor: string, nextDoor: string) => {
    setFloorDoorParts({ floor: nextFloor, door: nextDoor })
    onChange({ target: { name: 'floorDoor', value: combineFloorAndDoor(nextFloor, nextDoor) } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={location.pathname === '/checkout' ? 'form-orientation checkout' : 'form-orientation'}>
      <div className='input-group-container'>
        <ZipInput
          name='zip'
          value={formData.zip}
          onChange={onChange}
        />
        <CityInput
          name='city'
          value={formData.city}
          onChange={onChange}
        />
      </div>
      <div className='input-group-container'>
        <StreetNameInput
          name='streetName'
          value={streetName}
          onChange={e => emitStreetChange(e.target.value, streetType)}
        />
        <StreetTypeInput
          name='streetType'
          value={streetType}
          onChange={e => emitStreetChange(streetName, e.target.value)}
        />
      </div>
      <div className='input-group-container'>
        <StreetNumberInput
          name='streetNumber'
          value={formData.streetNumber}
          onChange={onChange}
        />
        <FloorInput
          name='floor'
          value={floor}
          onChange={e => emitFloorDoorChange(e.target.value, door)}
        />
        <DoorInput
          name='door'
          value={door}
          disabled={!floor}
          onChange={e => emitFloorDoorChange(floor, e.target.value)}
        />
      </div>
    </div>
  )
}
