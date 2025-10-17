import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Styles from '../styles/modal.module.css'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  handleCloseModal: () => void
  contentClassName?: string
}

const Modal = ({
  children,
  isOpen,
  handleCloseModal,
  contentClassName,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleCloseModal])

  const handleModalOverlayClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      handleCloseModal()
    }
  }
  if (!isOpen) return null
  const modalElement = document.getElementById('modal')
  if (!modalElement) {
    console.warn('Modal root element with id="modal" not found in the DOM.')
    return null
  }
  return createPortal(
    <div
      onClick={handleModalOverlayClose}
      role="dialog"
      aria-modal="true"
      className={Styles.overlay}
    >
      <div
        className={`${Styles.content} ${contentClassName ?? ''}`}
        role="document"
      >
        {children}
      </div>
    </div>,
    modalElement
  )
}

export default Modal
