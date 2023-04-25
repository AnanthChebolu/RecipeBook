import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import { Stack, Typography } from '@mui/material';
import RecipeGrid from '../../components/RecipeGrid/RecipeGrid';
import InteractionRecipeGrid from '../../components/RecipeGrid/InteractionRecipeGrid';

const MyRecipesPage: React.FunctionComponent = () => {
    return (
        <ProtectedRoute>
            <PageLayout title="My Recipes" maxWidth={'xl'}>
                <Stack>
                    <Typography align="center" variant="h2" marginBottom={5}>
                        My Recipes
                    </Typography>
                    <Stack spacing={5}>
                        <InteractionRecipeGrid limit={4} type="my-recipes" title="Created by me" />
                        <InteractionRecipeGrid limit={4} type="favorited" title="Favorited" />
                        <InteractionRecipeGrid limit={4} type="liked" title="Liked" />
                        <InteractionRecipeGrid limit={4} type="rated" title="Rated" />
                    </Stack>
                </Stack>
            </PageLayout>
        </ProtectedRoute>
    );
};

export default MyRecipesPage;
