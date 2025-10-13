import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Styles from '../styles/modal.module.css'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
}

const Modal = ({ children, isOpen }: ModalProps) => {
  if (!isOpen) return null
  const modalElement = document.getElementById('modal')
  if (!modalElement) {
    console.warn('Modal root element with id="modal" not found in the DOM.')
    return null
  }
  return createPortal(
    <div role="dialog" aria-modal="true" className={Styles.overlay}>
      <div className={Styles.content}>{children}</div>
    </div>,
    modalElement
  )
}

export default Modal
