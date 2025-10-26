import { useEffect, useState } from 'react'
import { type Comment } from '../utils/types'
import c from '../styles/comments.module.css'
import { createComment } from '../utils/api'

interface CommentsProps {
  postComments: Comment[]
  visibleCount?: number
  onShowAll?: () => void
  className?: string
  postId: string
}

const Comments = ({
  postComments,
  visibleCount = 2,
  onShowAll,
  className = '',
  postId,
}: CommentsProps) => {
  const [expanded, setExpanded] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(postComments)

  useEffect(() => {
    setComments(postComments)
    setExpanded(false)
  }, [postComments])

  const handleShowAll = () => {
    if (onShowAll) onShowAll()
    else setExpanded(true)
  }

  const list = expanded ? comments : comments.slice(0, visibleCount)

  return (
    <div className={`${c.comments} ${className}`}>
      {!expanded && comments.length > visibleCount && (
        <button
          type="button"
          className={c.showAll}
          onClick={handleShowAll}
          aria-label={`Show all ${comments.length} comments`}
        >
          Show all {comments.length} comments
        </button>
      )}

      {list.map((cmt) => {
        const author = (cmt as any).author
        const username = author?.username || 'User'
        const avatar = author?.avatarUrl || ''
        const createdAt = cmt.createdAt ? new Date(String(cmt.createdAt)) : null

        return (
          <div key={cmt.id} className={c.item}>
            <img
              className={c.avatar}
              src={avatar}
              alt={username}
              loading="lazy"
            />
            <div className={c.body}>
              <div className={c.header}>
                <span className={c.username}>{username}</span>

                <span className={c.meta}>
                  {createdAt && (
                    <time dateTime={createdAt.toISOString()}>
                      {createdAt.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  <span className={c.dot} />
                  <span>Reply</span>
                </span>
              </div>

              <div className={`${c.content} ${c.contentClamp}`}>
                {cmt.content}
              </div>

              <div className={c.actions}>
                <span className={c.action}>Like</span>
                <span className={c.action}>Reply</span>
              </div>
            </div>
          </div>
        )
      })}

      {comments.length === 0 && (
        <div className={c.empty}>No comments yet. Be the first!</div>
      )}

      <form
        className={c.addCommentForm}
        onSubmit={async (e) => {
          e.preventDefault()
          if (!newContent.trim()) return

          setIsSubmitting(true)
          try {
            const payload = {
              postId,
              content: newContent.trim(),
            }

            const saved = await createComment(payload)

            if (saved) {
              setComments((xs) => [...xs, saved])
            } else {
              console.warn('createComment returned empty response')
            }

            setNewContent('')
            if (!expanded) setExpanded(true)
          } catch (err) {
            console.error(err)
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        <input
          type="text"
          placeholder="Add a comment..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={isSubmitting}
          className={c.addCommentInput}
        />
        <button type="submit" disabled={isSubmitting || !newContent.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default Comments
