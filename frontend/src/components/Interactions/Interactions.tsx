import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useAuthContext } from '../../context/AuthContext';
import http from '../../utils/http';
import { Typography } from '@mui/material';

const StyledRatingLike = styled(Rating)({
    '& .MuiRating-iconEmpty': {
        color: '#ff6d75'
    },
    '& .MuiRating-iconFilled': {
        color: '#ff3d47'
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47'
    }
});
const StyledRatingShoppingList = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#34a203'
    },
    '& .MuiRating-iconHover': {
        color: '#34a203'
    },
    '& .MuiRating-iconEmpty': {
        color: '#6ec007'
    }
});

interface InteractionsProps {
    liked: boolean;
    addedToShoppingList: boolean;
    numLikes: number;
    recipeId: string;
    num_servings: number;
}

export const Interactions: React.FunctionComponent<InteractionsProps> = (
    props: InteractionsProps
) => {
    const { getAxiosConfig } = useAuthContext();
    const [liked, setLiked] = useState(props.liked);
    const [addedToShoppingList, setAddedToShoppingList] = useState(props.addedToShoppingList);
    const handleLike = async () => {
        try {
            const result = await http.post(
                `/recipes/${props.recipeId}/like/`,
                {},
                getAxiosConfig()
            );
            setLiked(result.data.is_liked);
        } catch (e) {
            console.log(e);
        }
    };
    const handleAddToShoppingList = async () => {
        try {
            const result = await http.post(
                `/recipes/${props.recipeId}/add-to-shopping-list/`,
                {
                    num_servings: props.num_servings
                },
                getAxiosConfig()
            );
            //result.data.recipe.original_recipe.in_shoppinglist
            setAddedToShoppingList(true);
        } catch (e) {
            console.log(e);
        }
    };
    const handleRemoveFromShoppingList = async () => {
        try {
            const result = await http.post(
                `/recipes/${props.recipeId}/add-to-shopping-list/`,
                {
                    num_servings: 0
                },
                getAxiosConfig()
            );
            setAddedToShoppingList(false);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                {liked ? (
                    <Typography sx={{ display: 'flex', color: '#ff3d47', marginRight: '.5rem' }}>
                        Dislike
                    </Typography>
                ) : (
                    <Typography sx={{ display: 'flex', color: '#ff6d75', marginRight: '.5rem' }}>
                        Like
                    </Typography>
                )}
                <StyledRatingLike
                    name="customized-color"
                    value={liked ? 1 : 0}
                    precision={1}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    max={1}
                    onChange={handleLike}
                    size="large"
                />
            </div>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                {!addedToShoppingList ? (
                    <Typography sx={{ display: 'flex', color: '#6ec007', marginRight: '.5rem' }}>
                        Add to your shopping list
                    </Typography>
                ) : (
                    <Typography sx={{ display: 'flex', color: '#34a203', marginRight: '.5rem' }}>
                        Remove from your shopping list
                    </Typography>
                )}
                <StyledRatingShoppingList
                    name="customized-color"
                    value={addedToShoppingList ? 1 : 0}
                    precision={1}
                    icon={<ShoppingBagIcon fontSize="inherit" />}
                    emptyIcon={<ShoppingBagOutlinedIcon fontSize="inherit" />}
                    max={1}
                    size="large"
                    onChange={
                        addedToShoppingList ? handleRemoveFromShoppingList : handleAddToShoppingList
                    }
                />
            </div>
        </div>
    );
};
