import Styles from '../styles/profile.module.css'

interface PostProps {
  id: number | string
  imageUrl: string
  description?: string
  location?: string
}

const PostTile = ({ id, imageUrl, description, location }: PostProps) => {
  return (
    <div className={Styles.postTile}>
      <img
        className={Styles.postImg}
        src={imageUrl}
        alt={description || 'Photo'}
        loading="lazy"
      />
    </div>
  )
}

export default PostTile
