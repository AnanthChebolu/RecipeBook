import React, { useEffect, useState } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useAuthContext } from '../../context/AuthContext';
import http from '../../utils/http';
import useSWR from 'swr';

interface InteractionRecipeGridProps {
    title: string;
    limit: number;
    type: 'liked' | 'rated' | 'favorited' | 'my-recipes';
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

const InteractionRecipeGrid: React.FunctionComponent<InteractionRecipeGridProps> = (
    props: InteractionRecipeGridProps
) => {
    const { getAxiosConfig } = useAuthContext();
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(1);
    const [recipeList, setRecipeList] = useState<React.ReactElement[]>([]);

    let url = `/recipes/${props.type}/?limit=${props.limit}&offset=${offset}`;

    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);

    const { data, error, isLoading } = useSWR(url, fetcher);

    useEffect(() => {
        if (data) {
            setRecipeList(createRecipeList(data.results));
        }
    }, [data, error, isLoading]);

    if (error) {
        return <h1>ERROR</h1>;
    }

    if (isLoading) {
        return <h1>LOADING</h1>;
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        setOffset((value - 1) * props.limit);
    };

    if (data.count === 0) {
        return (
            <Box>
                <Typography variant="h3">{props.title}</Typography>
                <hr></hr>
                <Typography variant="h4">None found</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3">{props.title}</Typography>
            <hr></hr>
            <Pagination
                count={Math.ceil(data.count / props.limit)}
                page={page}
                onChange={handleChange}
            />
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

export default InteractionRecipeGrid;
