import { Container, Typography } from '@mui/material';
import React from 'react';

interface IngredientProp {
    name: string;
    units: string;
    quantity: number;
}

interface IngredientsProps {
    ingredients: IngredientProp[];
    num_servings: number;
    prep_time: number;
    cook_time: number;
}
export const Ingredients: React.FunctionComponent<IngredientsProps> = ({
    ingredients,
    num_servings,
    prep_time,
    cook_time
}) => {
    return (
        <Container
            sx={{
                pt: 2,
                pb: 2
            }}
            maxWidth="md"
        >
            <Typography variant="h4" component="h2">
                Ingredients
                <hr style={{ marginTop: '0.5rem' }} />
            </Typography>
            <Typography
                sx={{
                    color: 'white',
                    backgroundColor: 'green',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    display: 'inline-block',
                    marginRight: '1rem',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}
                variant="h6"
            >{`Serves: ${num_servings}`}</Typography>
            <Typography
                sx={{
                    color: 'white',
                    backgroundColor: 'orange',
                    borderRadius: '4px',
                    marginRight: '1rem',
                    padding: '0.25rem 0.5rem',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}
                variant="h6"
            >{`Preparation Time: ${prep_time} minutes`}</Typography>
            <Typography
                sx={{
                    color: 'white',
                    backgroundColor: 'orange',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}
                variant="h6"
            >{`Active Cooking Time: ${cook_time} minutes`}</Typography>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.name}>
                        <Typography variant="h6">
                            {`${ingredient.quantity}${ingredient.units} - ${ingredient.name}`}
                        </Typography>
                    </li>
                ))}
            </ul>
        </Container>
    );
};
