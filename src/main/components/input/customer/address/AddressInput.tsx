import { ZipInput } from './ZipInput/ZipInput'
import { CityInput } from './CityInput/CityInput'
import { StreetInput } from './StreetInput/StreetInput'
import { StreetNumberInput } from './StreetNumberInput/StreetNumberInput'
import { FloorDoorInput } from './FloorDoorInput/FloorDoorInput'
import './AddressInput.css'
import { useLocation } from 'react-router-dom'

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
      <StreetInput
        name='street'
        value={formData.street}
        onChange={onChange}
      />
      <div className='input-group-container'>
        <StreetNumberInput
          name='streetNumber'
          value={formData.streetNumber}
          onChange={onChange}
        />
        <FloorDoorInput
          name='floorDoor'
          value={formData.floorDoor}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
