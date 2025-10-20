import { useState } from 'react'
import Styles from '../styles/profile.module.css'
import Modal from './Modal'
import postModalStyles from '../styles/postModal.module.css'
import Comments from './Comments'
import { type User, type Comment } from '../utils/types'

interface PostProps {
  id: string
  imageUrl: string
  description?: string
  location?: string
  usersById?: Map<User['id'], User>
  postComments?: Comment[]
}

const PostTile = ({
  id,
  imageUrl,
  description,
  location,
  usersById = new Map<User['id'], User>(),
  postComments = [],
}: PostProps) => {
  const comments: Array<{
    id: string | number
    author: string
    text: string
    createdAt?: string
  }> = []

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
        <Modal
          isOpen={isOpen}
          handleCloseModal={handleClosePostModal}
          contentClassName={postModalStyles.contentFit}
        >
          <div className={postModalStyles.wrapper}>
            <div className={postModalStyles.media}>
              <img
                className={postModalStyles.postImg}
                src={imageUrl}
                alt={description || 'Photo'}
                loading="lazy"
              />
            </div>

            <aside className={postModalStyles.sidebar}>
              <header className={postModalStyles.header}>
                <button
                  type="button"
                  className={postModalStyles.closeBtn}
                  onClick={handleClosePostModal}
                  aria-label="Close"
                >
                  ×
                </button>
              </header>

              {description && (
                <p className={postModalStyles.desc}>{description}</p>
              )}
              {location && (
                <p className={postModalStyles.location}>{location}</p>
              )}

              <Comments postComments={postComments} usersById={usersById} postId={id} className={postModalStyles.commentsInModal}/>
            </aside>
          </div>
        </Modal>
      )}
    </>
  )
}

export default PostTile
