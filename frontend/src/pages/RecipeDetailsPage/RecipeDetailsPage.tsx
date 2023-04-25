import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { Recipe } from '../../components/Recipe/Recipe';
import { useParams } from 'react-router-dom';

const RecipeDetailsPage: React.FunctionComponent = () => {
    const { recipeId } = useParams();
    if (!recipeId) {
        return <div>Recipe not found</div>;
    }
    return (
        <PageLayout title="Recipe Details" maxWidth={'xl'}>
            <Recipe recipeId={recipeId} />
        </PageLayout>
    );
};

export default RecipeDetailsPage;
