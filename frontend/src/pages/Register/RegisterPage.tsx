import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { Container, Grid, Stack } from '@mui/material';
import FoodImageList from '../../components/FoodImageList/FoodImageList';
import NonProtectedRoute from '../../components/NonProtectedRoute/NonProtectedRoute';

const RegisterPage: React.FunctionComponent = () => {
    return (
        <NonProtectedRoute>
            <PageLayout title="Register" maxWidth="xl">
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <Container>
                            <FoodImageList />
                        </Container>
                    </Grid>
                    <Grid item xs={5}>
                        <RegisterForm />
                    </Grid>
                </Grid>
            </PageLayout>
        </NonProtectedRoute>
    );
};

export default RegisterPage;
