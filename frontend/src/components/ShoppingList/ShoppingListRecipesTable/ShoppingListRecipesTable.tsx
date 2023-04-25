import React from 'react';
import { KeyedMutator } from 'swr';
import { Ingredient, Recipe } from '../ShoppingList';
import {
    Container,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import ShoppingListServingForm from '../ShoppingListServingForm';
import { Link } from 'react-router-dom';

interface ShoppingListRecipesTableProps {
    mutate: KeyedMutator<any>;
    recipes: Recipe[];
    width: string | number;
}

const ShoppingListRecipesTable: React.FunctionComponent<ShoppingListRecipesTableProps> = (
    props: ShoppingListRecipesTableProps
) => {
    return (
        <Stack spacing={1}>
            <TableContainer component={Paper} sx={{ width: props.width }}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">
                                    <strong>Image</strong>
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6">
                                    <strong>Recipe Name</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">
                                    <strong>Ingredients</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">
                                    <strong>Quantity</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">
                                    <strong>Total Ingredients</strong>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.recipes.map((recipe: Recipe) => (
                            <TableRow
                                key={recipe.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    <img
                                        src={
                                            recipe.images.length > 0
                                                ? recipe.images[0]
                                                : '/foodboiler.jpg'
                                        }
                                        style={{ maxWidth: 200, maxHeight: 400, borderRadius: 10 }}
                                    />
                                </TableCell>
                                <TableCell component="td" scope="row">
                                    <MenuItem component={Link} to={`/recipes/${recipe.id}`}>
                                        <Typography variant="h6">{recipe.name}</Typography>
                                    </MenuItem>
                                </TableCell>
                                <TableCell component="td" align="right">
                                    {recipe.ingredients.map((ing: Ingredient) => (
                                        <Typography variant="h6">{`${ing.quantity} ${ing.units} ${ing.name}`}</Typography>
                                    ))}
                                </TableCell>
                                <TableCell component="td" align="right">
                                    <ShoppingListServingForm
                                        recipe={recipe}
                                        mutate={props.mutate}
                                    />
                                </TableCell>
                                <TableCell component="td" align="right">
                                    {recipe.modifiedIngredients.map((ing: Ingredient) => (
                                        <Typography variant="h6">{`${ing.quantity} ${ing.units} ${ing.name}`}</Typography>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default ShoppingListRecipesTable;
