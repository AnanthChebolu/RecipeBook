import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import http from '../../../utils/http';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { IconButton, Typography } from '@mui/material';
const StyledRatingFavourite = styled(Rating)({
    '& .MuiRating-iconEmpty': {
        color: '#2d83e3'
    },
    '& .MuiRating-iconFilled': {
        color: '#2d83e3'
    },
    '& .MuiRating-iconHover': {
        color: '#2d83e3'
    }
});

interface InteractionsProps {
    favourited: boolean;
    recipeId: string;
}

export const FavouriteButton: React.FunctionComponent<InteractionsProps> = (
    props: InteractionsProps
) => {
    const { getAxiosConfig } = useAuthContext();
    const [favourited, setFavourited] = useState(props.favourited);
    const handleFavourite = async () => {
        try {
            const result = await http.post(
                `/recipes/${props.recipeId}/favorite/`,
                {},
                getAxiosConfig()
            );
            setFavourited(result.data.is_favourited);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
            {favourited ? (
                <Typography sx={{ display: 'flex', color: '#2d83e3' }}>
                    Unfavourite this recipe{' '}
                </Typography>
            ) : (
                <Typography sx={{ display: 'flex', color: '#2d83e3' }}>
                    Favourite this recipe{' '}
                </Typography>
            )}
            <StyledRatingFavourite
                name="customized-color"
                value={favourited ? 1 : 0}
                precision={1}
                icon={<BookmarkAddIcon fontSize="inherit" />}
                emptyIcon={<BookmarkAddOutlinedIcon fontSize="inherit" />}
                max={1}
                onChange={handleFavourite}
                size="large"
            />
        </div>
    );
};
