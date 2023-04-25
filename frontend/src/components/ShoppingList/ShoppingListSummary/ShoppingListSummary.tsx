import React, { useEffect, useState } from 'react';
import { Ingredient } from '../ShoppingList';
import {
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

interface ShoppingListSummaryProps {
    ingredients: Ingredient[];
    width: string | number;
}

interface IngredientValues {
    units: string;
    name: string;
    quantity: number;
}

const ShoppingListSummary: React.FunctionComponent<ShoppingListSummaryProps> = (
    props: ShoppingListSummaryProps
) => {
    const summary: { [name: string]: IngredientValues } = {};
    for (let ingredient of props.ingredients) {
        const key = `${ingredient.name} ${ingredient.units}`.toLowerCase();
        if (summary.hasOwnProperty(key)) {
            summary[key].quantity += ingredient.quantity;
        } else {
            summary[key] = {
                units: ingredient.units,
                quantity: ingredient.quantity,
                name: ingredient.name
            };
        }
    }

    return (
        <Stack spacing={1}>
            <Typography variant="h4">
                <strong>Summary</strong>
            </Typography>
            <TableContainer component={Paper} sx={{ width: props.width }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h6">
                                    <strong>Ingredient Name</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">
                                    <strong>Quantity</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="h6">
                                    <strong>Units</strong>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(summary).map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="td" scope="row">
                                    <Typography variant="h6">{row.name}</Typography>
                                </TableCell>
                                <TableCell component="td" align="right">
                                    <Typography variant="h6">{row.quantity}</Typography>
                                </TableCell>
                                <TableCell component="td" align="right">
                                    <Typography variant="h6">{row.units}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default ShoppingListSummary;
