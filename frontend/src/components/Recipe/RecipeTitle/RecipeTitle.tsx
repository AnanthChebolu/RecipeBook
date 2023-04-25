import { Container, Typography } from '@mui/material';
import React from 'react';
import http from '../../../utils/http';
import { useAuthContext } from '../../../context/AuthContext';
import { Cuisine, Diet } from '../../Tags/Tags';
import useSWR from 'swr';
import { Button } from '@mui/material';
import { FavouriteButton } from '../../Interactions/FavouriteButton/FavouriteButton';
import IosShareIcon from '@mui/icons-material/IosShare';
import { ReadOnlyRating } from '../../Interactions/ReadOnlyRating/ReadOnlyRating';
import { Link } from 'react-router-dom';
import { Tags } from '../../Tags/Tags';

interface RecipeTitleProps {
    recipeId: string;
    name: string;
    owner: string;
    date_created: string;
    num_rates: number;
    rating: number;
    base_recipe: number | null;
    cuisines: Cuisine[];
    diets: Diet[];
    likes: number;
    favorites: number;
    is_favourited: boolean;
}
const BaseRecipeTitle: React.FunctionComponent<{ baseRecipeId: number }> = ({ baseRecipeId }) => {
    const { getAxiosConfig } = useAuthContext();

    const url: string = `/recipes/${baseRecipeId}/view/`;
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);

    const { data, error, isLoading } = useSWR(url, fetcher);
    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading</div>;
    return (
        <Typography sx={{ fontWeight: 'medium', m: '.5rem' }}>
            <Link
                to={`/recipes/${baseRecipeId}`}
                style={{ textDecoration: 'none', color: 'blueviolet' }}
            >
                {`This recipe was inspired by ${data.name}`}
            </Link>
        </Typography>
    );
};

const getDate = (date: string) => {
    const DATE = new Date(date);
    return DATE.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};
export const RecipeTitle: React.FunctionComponent<RecipeTitleProps> = (props: RecipeTitleProps) => {
    return (
        <Container
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h2">{`${props.name}`}</Typography>
            <Typography variant="h5">{`by ${props.owner}`}</Typography>
            <Tags cuisineTags={props.cuisines} dietTags={props.diets} />
            <Typography sx={{ m: '.5rem' }} variant="h6">{`Created on ${getDate(
                props.date_created
            )}`}</Typography>
            {props.base_recipe && BaseRecipeTitle({ baseRecipeId: props.base_recipe })}
            <ReadOnlyRating rating={props.rating} num_ratings={props.num_rates} />

            <FavouriteButton favourited={props.is_favourited} recipeId={props.recipeId} />
            <Link
                to={`/recipes/create?base_recipe_id=${props.recipeId}`}
                style={{ textDecoration: 'none' }}
            >
                <Button variant="contained" endIcon={<IosShareIcon />}>
                    Extend Recipe
                </Button>
            </Link>
        </Container>
    );
};
