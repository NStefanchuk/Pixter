import { type Comment, type User } from '../utils/types'

interface CommentsProps {
  postComments: Comment[]
  usersById: Map<User['id'], User>
}

const Comments = ({ postComments, usersById }: CommentsProps) => {
  return (
    <div>
      {postComments.slice(0, 2).map((c) => (
        <p key={c.id}>
          <strong>{usersById.get(c.userId)?.username ?? 'User'}:</strong>{' '}
          {c.content}
        </p>
      ))}
    </div>
  )
}

export default Comments
