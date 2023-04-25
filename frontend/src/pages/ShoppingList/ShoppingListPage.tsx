import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { Container, Stack, Typography } from '@mui/material';

const ShoppingListPage: React.FunctionComponent = () => {
    return (
        <ProtectedRoute>
            <PageLayout title="Your Shopping List" maxWidth={'xl'}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Typography variant="h3" align={'center'}>
                            <strong>Your Shopping List</strong>
                        </Typography>
                        <Typography variant="h5" align={'center'}>
                            Here are all the recipes you added to your shopping list
                        </Typography>
                        <hr />
                    </Stack>
                    <ShoppingList />
                </Stack>
            </PageLayout>
        </ProtectedRoute>
    );
};

export default ShoppingListPage;
