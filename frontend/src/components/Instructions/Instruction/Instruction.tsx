import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography } from '@mui/material';
import ReactPlayer from 'react-player';
interface InstructionProp {
    images: ImagesInterface[];
    videos: VideosInterface[];
    prep_time: number | null;
    cooking_time: number | null;
    instruction: string;
    instruction_number: number;
}
export interface ImagesInterface {
    url: string;
    id: number;
}
export interface VideosInterface {
    url: string;
    id: number;
}
export const Instruction: React.FunctionComponent<InstructionProp> = (props: InstructionProp) => {
    const allMedia = [...props.images, ...props.videos];
    return (
        <div>
            <Typography
                variant="h6"
                sx={{
                    marginRight: '1rem',
                    display: 'inline-block',
                    fontWeight: 'bold',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#333'
                }}
                gutterBottom
            >{`Step ${props.instruction_number}`}</Typography>
            <Typography
                sx={{
                    color: 'white',
                    backgroundColor: 'orange',
                    borderRadius: '4px',
                    marginRight: '1rem',
                    padding: '0.25rem 0.5rem',
                    display: 'inline-block',
                    fontSize: '.65rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}
                variant="h6"
            >{`Preparation Time: ${props.prep_time} minutes`}</Typography>
            <Typography
                sx={{
                    color: 'white',
                    backgroundColor: 'orange',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    display: 'inline-block',
                    fontSize: '.65rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}
                variant="h6"
            >{`Active Cooking Time: ${props.cooking_time} minutes`}</Typography>
            <Box sx={{ pl: 2 }}>
                <Typography variant="body1" gutterBottom>{`${props.instruction}`}</Typography>
            </Box>
            {allMedia.length !== 0 && (
                <Box sx={{ width: 'auto', height: 'auto', overflowY: 'scroll' }}>
                    <ImageList variant="masonry" cols={3} gap={15}>
                        {allMedia.map((item, i) => (
                            <ImageListItem key={i + 100}>
                                {!item.url.includes('mp4') && (
                                    <img
                                        src={`http://localhost:8000${item.url}?w=248&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={''}
                                        loading="lazy"
                                    />
                                )}
                                {item.url.includes('mp4') && (
                                    <video controls width="250" key={item.id}>
                                        <source
                                            src={`http://localhost:8000${item.url}`}
                                            type={'video/mp4'}
                                        />
                                    </video>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            )}
        </div>
    );
};
