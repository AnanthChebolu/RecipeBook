import React, { useEffect, useState } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useAuthContext } from '../../context/AuthContext';
import http from '../../utils/http';
import useSWR from 'swr';

interface SearchRecipeGridProps {
    limit: number;
    search: string;
    cuisine: string;
    diet: string;
    page: number;
    setPage: Function;
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

const SearchRecipeGrid: React.FunctionComponent<SearchRecipeGridProps> = (
    props: SearchRecipeGridProps
) => {
    const { getAxiosConfig } = useAuthContext();
    const [offset, setOffset] = useState(props.limit * (props.page - 1));
    const [recipeList, setRecipeList] = useState<React.ReactElement[]>([]);
    let url = `/recipes/?limit=${props.limit}&offset=${offset}`;

    if (props.search) {
        url += `&search=${props.search}`;
    }

    if (props.cuisine) {
        url += `&cuisines__name=${props.cuisine}`;
    }

    if (props.diet) {
        url += `&diets__name=${props.diet}`;
    }

    console.log(url);
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
        props.setPage(value);
        setOffset((value - 1) * props.limit);
    };

    if (data.count === 0) {
        return (
            <Box>
                <Typography variant="h3">No results</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3">Search Results</Typography>
            <Pagination
                count={Math.ceil(data.count / props.limit)}
                page={props.page}
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

export default SearchRecipeGrid;
