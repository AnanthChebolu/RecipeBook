import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../../../context/AuthContext';
import { useState } from 'react';
import http from '../../../utils/http';
import { mutate } from 'swr';

interface WriteRatingProps {
    user_rating: number;
    recipeId: string;
    recipe_name: string;
}
export const WriteRating: React.FunctionComponent<WriteRatingProps> = (props: WriteRatingProps) => {
    const [value, setValue] = React.useState<number | null>(props.user_rating);

    const { getAxiosConfig } = useAuthContext();
    const handleRate = async (newRating: number | null) => {
        try {
            const result = await http.post(
                `/recipes/${props.recipeId}/rate/`,
                {
                    rating: newRating
                },
                getAxiosConfig()
            );
            if (newRating === value || !newRating) {
                setValue(0);
            } else {
                setValue(newRating);
            }
            await mutate(`/recipes/${props.recipeId}/view/`);
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
                justifyContent: 'center',
                marginTop: '1rem',
                marginBottom: '1rem'
            }}
        >
            <Typography
                variant={'h5'}
                sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1rem'
                }}
            >
                {`How would you rate ${props.recipe_name}?`}
            </Typography>
            <Rating
                name="no-value"
                value={value}
                max={5}
                precision={0.5}
                sx={{ fontSize: '48px', marginBottom: '1rem' }}
                onChange={(event, newValue) => {
                    handleRate(newValue ? newValue : value);
                }}
            />
        </div>
    );
};
