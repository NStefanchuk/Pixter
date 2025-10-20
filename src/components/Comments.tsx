// src/components/Comments.tsx
import { type Comment, type User } from '../utils/types'
import c from '../styles/comments.module.css'

interface CommentsProps {
  postComments: Comment[]
  usersById: Map<User['id'], User>
  /** How many comments to show in-card */
  visibleCount?: number
}

const Comments = ({ postComments, usersById, visibleCount = 2 }: CommentsProps) => {
  const visible = postComments.slice(0, visibleCount)

  return (
    <div className={c.comments}>
      {postComments.length > visibleCount && (
        <div className={c.showAll}>
          Show all {postComments.length} comments
        </div>
      )}

      {visible.map((cmt) => {
        const user = usersById.get(cmt.userId)
        const username = user?.username || 'User'
        const avatar = user?.avatarUrl

        const createdAt =
          'createdAt' in cmt && cmt.createdAt
            ? new Date(String(cmt.createdAt))
            : null

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

      {postComments.length === 0 && (
        <div className={c.empty}>No comments yet. Be the first!</div>
      )}
    </div>
  )
}

export default Comments
