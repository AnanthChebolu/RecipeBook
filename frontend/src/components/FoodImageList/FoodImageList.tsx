import React from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import foodimg1 from '../../../public/foodimg1.jpg';
import foodimg2 from '../../../public/foodimg2.jpeg';
import foodimg3 from '../../../public/foodimg3.jpg';
import foodimg4 from '../../../public/foodimg4.jpg';
import foodimg5 from '../../../public/foodimg5.jpeg';
import foodimg6 from '../../../public/foodimg6.jpeg';
import foodimg7 from '../../../public/foodimg7.jpg';
import foodimg8 from '../../../public/foodimg8.jpg';
import foodimg9 from '../../../public/foodimg9.jpg';

const PICTURES = [
    '/foodimg1.jpg',
    '/foodimg2.jpg',
    '/foodimg3.jpg',
    '/foodimg4.jpg',
    '/foodimg5.jpg',
    '/foodimg6.jpg',
    '/foodimg7.jpg',
    '/foodimg8.jpeg',
    '/foodimg9.jpeg'
];

const FoodImageList: React.FunctionComponent = () => {
    // Source: https://mui.com/material-ui/react-image-list/
    return (
        <ImageList sx={{ width: 700, height: 700, borderRadius: 4 }} cols={3} rowHeight={220}>
            {/*This does randomizing. Source: https://stackoverflow.com/a/46545530 */}
            {PICTURES.map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map((image) => (
                    <ImageListItem key={image.value}>
                        <img src={image.value} srcSet={image.value} loading="lazy" />
                    </ImageListItem>
                ))}
        </ImageList>
    );
};

export default FoodImageList;
