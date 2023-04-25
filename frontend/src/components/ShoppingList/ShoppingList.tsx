import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useSWR from 'swr';
import http from '../../utils/http';
import ShoppingListSummary from './ShoppingListSummary/ShoppingListSummary';
import { Container, Stack } from '@mui/material';
import ShoppingListRecipesTable from './ShoppingListRecipesTable/ShoppingListRecipesTable';

interface ShoppingListProps {}

export interface Ingredient {
    name: string;
    units: string;
    quantity: number;
}

export interface Recipe {
    id: number;
    name: string;
    ingredients: Ingredient[];
    modifiedIngredients: Ingredient[];
    images: string[];
    servings: number;
}

const extractModifiedIngredients = (shoppingListData: any): Ingredient[] => {
    const modifiedIngredients: Ingredient[] = [];
    for (let entry of shoppingListData) {
        modifiedIngredients.push(...entry.recipe.modified_ingredients);
    }

    return modifiedIngredients;
};

const extractOriginalRecipes = (shoppingListData: any): Recipe[] => {
    const originalRecipes: Recipe[] = [];

    for (let entry of shoppingListData) {
        let recipe: Recipe = {
            id: entry.recipe.original_recipe.id,
            name: entry.recipe.original_recipe.name,
            ingredients: entry.recipe.original_recipe.ingredients,
            servings: entry.num_servings,
            modifiedIngredients: entry.recipe.modified_ingredients,
            images: entry.recipe.original_recipe.images.map(
                (img: { url: any }) => `http://localhost:8000${img.url}`
            )
        };

        originalRecipes.push(recipe);
    }

    return originalRecipes;
};

const ShoppingList: React.FunctionComponent<ShoppingListProps> = () => {
    const url = '/recipes/shopping-list/';
    const { getAxiosConfig } = useAuthContext();
    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const { data, mutate, isLoading, error } = useSWR(url, fetcher);

    const [modifiedIngredients, setModifiedIngredients] = useState<Ingredient[]>([]);
    const [originalRecipes, setOriginalRecipes] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            const modifiedIngredientData = extractModifiedIngredients(data);
            setModifiedIngredients(modifiedIngredientData);

            const originalRecipeData = extractOriginalRecipes(data);
            setOriginalRecipes(originalRecipeData);
        }
    }, [data, error, isLoading]);

    if (error) return <div>An error occurred</div>;

    if (isLoading) return <div>Loading</div>;

    return (
        <div>
            <Stack spacing={2}>
                <ShoppingListSummary ingredients={modifiedIngredients} width="30%" />
                <hr />
                <ShoppingListRecipesTable mutate={mutate} recipes={originalRecipes} width="100%" />
            </Stack>
        </div>
    );
};

export default ShoppingList;
