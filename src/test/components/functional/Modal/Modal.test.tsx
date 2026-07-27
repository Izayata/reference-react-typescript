import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../../../../main/components/functional/Modal/Modal'

describe('Modal', () => {
  it('renders with dialog semantics and focuses the OK button on open', () => {
    render(<Modal message="Hiba történt!" onClose={jest.fn()} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-message')
    expect(screen.getByText('Hiba történt!')).toHaveAttribute('id', 'modal-message')
    expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus()
  })

  it('calls onClose when the OK button is clicked', () => {
    const onClose = jest.fn()
    render(<Modal message="Siker!" onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = jest.fn()
    render(<Modal message="Hiba történt!" onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps focus on the OK button when Tab is pressed', () => {
    render(<Modal message="Hiba történt!" onClose={jest.fn()} />)

    const okButton = screen.getByRole('button', { name: 'OK' })
    expect(okButton).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(okButton).toHaveFocus()
  })
})
