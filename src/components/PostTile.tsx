import { useState } from 'react'
import Styles from '../styles/profile.module.css'
import Modal from './Modal'
import postModalStyles from '../styles/postModal.module.css'

interface PostProps {
  id: number | string
  imageUrl: string
  description?: string
  location?: string
}

const PostTile = ({ id, imageUrl, description, location }: PostProps) => {
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

              <section
                className={postModalStyles.comments}
                aria-label="Comments"
              >
                {comments.length > 0 ? (
                  <ul className={postModalStyles.list}>
                    {comments.map((c) => (
                      <li key={c.id} className={postModalStyles.comment}>
                        <b className={postModalStyles.author}>{c.author}</b>{' '}
                        <span className={postModalStyles.text}>{c.text}</span>
                        {c.createdAt && (
                          <time
                            className={postModalStyles.time}
                            dateTime={c.createdAt}
                          >
                            {c.createdAt}
                          </time>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={postModalStyles.empty}>No comments yet</div>
                )}
              </section>
            </aside>
          </div>
        </Modal>
      )}
    </>
  )
}

export default PostTile
