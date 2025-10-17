import { useState } from 'react'
import Styles from '../styles/profile.module.css'
import Modal from './Modal'

interface PostProps {
  id: number | string
  imageUrl: string
  description?: string
  location?: string
}

const PostTile = ({ id, imageUrl, description, location }: PostProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpenPostModal = () => {
    setIsOpen(true)
  }
  const handleClosePostModal = () => {
    setIsOpen(false)
  }
  return (
    <>
      <div className={Styles.postTile} onClick={handleOpenPostModal}>
        <img
          className={Styles.postImg}
          src={imageUrl}
          alt={description || 'Photo'}
          loading="lazy"
        />
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} handleCloseModal={handleClosePostModal}>
          <img
            className={Styles.postImg}
            src={imageUrl}
            alt={description || 'Photo'}
            loading="lazy"
          />
        </Modal>
      )}
    </>
  )
}

export default PostTile
