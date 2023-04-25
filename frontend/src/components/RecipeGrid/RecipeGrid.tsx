import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useAuthContext } from '../../context/AuthContext';
import http from '../../utils/http';
import useSWR from 'swr';

interface RecipeGridProps {
    title: string;
    url: string;
}

function createRecipeList(data: any): React.ReactElement[] {
    const recipeList: React.ReactElement[] = [];
    for (let recipe of data) {
        recipeList.push(
            <Grid key={recipe.id}>
                <RecipeCard
                    id={recipe.id}
                    author={recipe.owner}
                    images={recipe.images}
                    likes={recipe.likes}
                    name={recipe.name}
                    rating={recipe.rating}
                    time={recipe.overall_cooking_time}
                />
            </Grid>
        );
    }
    return recipeList;
}

const RecipeGrid: React.FunctionComponent<RecipeGridProps> = (props: RecipeGridProps) => {
    const { getAxiosConfig } = useAuthContext();
    const [recipeList, setRecipeList] = useState<React.ReactElement[]>([]);
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);

    const { data, error } = useSWR(props.url, fetcher);

    useEffect(() => {
        if (data) {
            setRecipeList(createRecipeList(data));
        }
    }, [data]);

    if (error) {
        return <h1>ERROR</h1>;
    }

    return (
        <Box>
            <Typography variant="h3">{props.title}</Typography>
            <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                justifyContent={{
                    xs: 'center',
                    sm: 'start',
                    md: 'start'
                }}
                alignItems="center"
            >
                {recipeList.map((element) => element)}
            </Grid>
        </Box>
    );
};

export default RecipeGrid;
