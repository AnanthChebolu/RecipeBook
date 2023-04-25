import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import GradeIcon from '@mui/icons-material/Grade';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
    id: number;
    name: string;
    images: any[];
    likes: number;
    rating: number;
    time: number;
    author: string;
}

const RecipeCard: React.FunctionComponent<RecipeCardProps> = (props: RecipeCardProps) => {
    const navigate = useNavigate();

    const url =
        props.images.length > 0
            ? 'http://localhost:8000'.concat(props.images[0].url)
            : '/foodboiler.jpg';

    return (
        <Card sx={{ maxWidth: 300, m: 3 }}>
            <CardMedia component="img" image={url} sx={{ width: 300, height: 'auto' }} />
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    By {props.author}
                </Typography>
                <Typography variant="body2">
                    <AvTimerIcon /> {props.time} mins
                    <br />
                    <ThumbUpIcon /> {props.likes} likes
                    <br />
                    <GradeIcon /> {props.rating} rating
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => navigate(`/recipes/${props.id}`)}>
                    Recipe Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default RecipeCard;
