import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { imagePath } from '../services/api'
import { DeleteIcon, StarIcon } from '@chakra-ui/icons'

const CardComponent = ({ item, type, onRemove }) => {  // Add onRemove to props
    return (
        <Box position={"relative"} transform={"scale(1)"} _hover={{
            transform: {base: "scale(1)", md: "scale(1.08)"},
            transition: "transform 0.2s ease-in-out",
            zIndex: "10",
            "& .overlay": {
                opacity: 1, 
            }
        }}>
            {/* Remove Button for watchlist */}
            {onRemove && (
                <IconButton 
                    aria-label="Remove from watchlist"
                    icon={<DeleteIcon />}
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={2}
                    colorScheme="red"
                    size="sm"
                    borderRadius="full"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(item.id);
                    }}
                    _hover={{ transform: 'scale(1.1)' }}
                />
            )}

            <Link to={`/${type}/${item?.id}`}>
                <Image 
                    src={`${imagePath}/${item?.poster_path}`} 
                    alt={item?.title || item?.name} 
                    height={"100%"}
                    width="100%"
                    objectFit="cover"
                />
                <Box 
                    className='overlay'
                    pos={"absolute"} 
                    p="2" 
                    bottom={"0"} 
                    left={"0"} 
                    w={"100%"} 
                    h={"33%"} 
                    bg={"rgba(0, 0, 0, 0.9)"} 
                    opacity={"0"}
                    transition={"opacity 0.3s ease-in-out"}
                >
                    <Text textAlign={"center"} noOfLines={1}>
                        {item?.title || item?.name}
                    </Text>
                    <Text textAlign={"center"} fontSize={"x-small"} color={"green.200"}>
                        {new Date(item?.release_date || item?.first_air_date).getFullYear() || "N/A"}
                    </Text>
                    <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={"2"}
                        mt={"4"}
                    >
                        <StarIcon fontSize={"small"}/>
                        <Text>{item?.vote_average?.toFixed(1)}</Text>
                    </Flex>
                </Box>
            </Link>
        </Box>
    )
}

export default CardComponent