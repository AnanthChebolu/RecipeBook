import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { Container, Grid } from '@mui/material';
import FoodImageList from '../../components/FoodImageList/FoodImageList';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import NonProtectedRoute from '../../components/NonProtectedRoute/NonProtectedRoute';

const LoginPage: React.FunctionComponent = () => {
    return (
        <NonProtectedRoute>
            <PageLayout title="Login" maxWidth={'xl'}>
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <Container>
                            <FoodImageList />
                        </Container>
                    </Grid>
                    <Grid item xs={5}>
                        <LoginForm />
                    </Grid>
                </Grid>
            </PageLayout>
        </NonProtectedRoute>
    );
};

export default LoginPage;
