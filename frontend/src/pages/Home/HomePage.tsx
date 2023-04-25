import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import NonProtectedRoute from '../../components/NonProtectedRoute/NonProtectedRoute';
import { Stack, Typography } from '@mui/material';
import RecipeGrid from '../../components/RecipeGrid/RecipeGrid';
import { SearchBar } from '../../components/SearchBar/SearchBar';

const HomePage: React.FunctionComponent = () => {
    return (
        <NonProtectedRoute>
            <PageLayout title="Home" maxWidth={'xl'}>
                <Stack spacing={3}>
                    <Typography align={'center'} variant="h2" marginBottom={5}>
                        Welcome to Easy Chef!
                    </Typography>
                    <SearchBar></SearchBar>
                    <RecipeGrid url={'/recipes/latest/'} title={'Latest Recipes'}></RecipeGrid>
                    <RecipeGrid url={'/recipes/popular/'} title={'Popular Recipes'}></RecipeGrid>
                </Stack>
            </PageLayout>
        </NonProtectedRoute>
    );
};

export default HomePage;
