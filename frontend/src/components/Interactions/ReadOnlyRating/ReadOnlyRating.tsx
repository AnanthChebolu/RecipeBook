import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

interface ReadOnlyRatingProps {
    rating: number;
    num_ratings: number;
}

export const ReadOnlyRating: React.FunctionComponent<ReadOnlyRatingProps> = (
    props: ReadOnlyRatingProps
) => {
    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
                display: 'flex',
                marginBottom: '1rem'
            }}
        >
            <Typography sx={{ fontWeight: 'bold', m: 1 }}>{`${props.rating.toFixed(
                1
            )}`}</Typography>
            <Rating
                name="read-only"
                value={props.rating}
                precision={0.1}
                style={{ fontSize: 40 }}
                readOnly
            />
            <Typography>{`(${props.num_ratings})`}</Typography>
        </Box>
    );
};
