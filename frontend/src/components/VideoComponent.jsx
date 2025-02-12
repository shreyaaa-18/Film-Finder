import PropTypes from 'prop-types'

const VideoComponent = ({id, small = true}) => {
  return (
    <iframe 
        width="100%" 
        height={small ? "150" : "100%"}
        style={{
            border: "none",
            display: "block",
            objectFit: "cover",
        }}      
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player" 
        allowFullScreen
        ></iframe>
  )
}

VideoComponent.propTypes = {
    id: PropTypes.string.isRequired,
    small: PropTypes.bool,  
}

export default VideoComponent
