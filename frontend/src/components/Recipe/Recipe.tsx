import { Button, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import http, { BASE_URL } from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';
import useSWR from 'swr';
import { RecipeTitle } from './RecipeTitle/RecipeTitle';
import { Ingredients } from '../Ingredients/Ingredients';
import { Instructions } from '../Instructions/Instructions';
import { ImageCarousel } from '../Carousel/Carousel';
import { WriteRating } from '../Interactions/WriteRating/WriteRating';
import { Comments } from '../Comment/Comments';
import { Interactions } from '../Interactions/Interactions';
import { DeleteButton } from '../Interactions/DeleteButton/DeleteButton';
import { EditButton } from '../Interactions/EditButton/EditButton';

interface RecipeProps {
    recipeId: string;
}

export const Recipe: React.FunctionComponent<RecipeProps> = (props: RecipeProps) => {
    const { getAxiosConfig } = useAuthContext();
    const url: string = `/recipes/${props.recipeId}/view/`;
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const { data, error, isLoading } = useSWR(url, fetcher);
    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading</div>;
    const allMedia = data.images.concat(data.videos);
    return (
        <div>
            {allMedia && <ImageCarousel mediaLinks={allMedia} />}
            <RecipeTitle
                recipeId={props.recipeId}
                name={data.name}
                owner={data.owner}
                date_created={data.date_created}
                num_rates={data.num_rates}
                rating={data.rating}
                base_recipe={data.base_recipe_id}
                cuisines={data.cuisines}
                diets={data.diets}
                likes={data.likes}
                favorites={data.favorites}
                is_favourited={data.is_favourited}
            />
            <Ingredients
                ingredients={data.ingredients}
                num_servings={data.num_servings}
                prep_time={data.overall_prep_time}
                cook_time={data.overall_cooking_time}
            />
            <Instructions instructions={data.instructions} />
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                <Interactions
                    liked={data.is_liked}
                    addedToShoppingList={data.in_shoppinglist}
                    numLikes={data.likes}
                    recipeId={props.recipeId}
                    num_servings={data.num_servings}
                />
                <EditButton isOwner={data.is_owner} recipeId={props.recipeId} data={data} />
                <DeleteButton isOwner={data.is_owner} recipeId={props.recipeId} />
                <WriteRating
                    recipe_name={data.name}
                    recipeId={props.recipeId}
                    user_rating={data.user_rating}
                />
            </Container>
            <Comments queryLimit={5} recipeId={props.recipeId} />
        </div>
    );
};
