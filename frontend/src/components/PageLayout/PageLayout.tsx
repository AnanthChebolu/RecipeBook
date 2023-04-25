import React from 'react';
import { Container, CssBaseline, Grid } from '@mui/material';
import Navbar from '../Navbar/Navbar';

interface PageLayoutProps {
    title: string;
    maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    children?: React.ReactNode;
}

const PageLayout: React.FunctionComponent<PageLayoutProps> = (props: PageLayoutProps) => {
    return (
        <Grid container spacing={2}>
            <CssBaseline />
            <Grid item xs={12}>
                <Navbar />
            </Grid>
            <Grid item xs={12} key={`${props.title}Id`}>
                <Container maxWidth={props.maxWidth}>{props.children}</Container>
            </Grid>
        </Grid>
    );
};

export default PageLayout;
