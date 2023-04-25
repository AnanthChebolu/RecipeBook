import { Form, FormikProvider, useFormik } from 'formik';
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import http from '../../utils/http';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useSWR from 'swr';
import SearchRecipeGrid from '../RecipeGrid/SearchRecipeGrid';

function createCuisineList(data: any): React.ReactElement[] {
    const cuisineList: React.ReactElement[] = [];
    for (let cuisine of data) {
        cuisineList.push(
            <MenuItem value={cuisine.name} key={cuisine.name}>
                {cuisine.name}
            </MenuItem>
        );
    }
    return cuisineList;
}

function createDietList(data: any): React.ReactElement[] {
    const dietList: React.ReactElement[] = [];
    for (let diet of data) {
        dietList.push(
            <MenuItem value={diet.name} key={diet.name}>
                {diet.name}
            </MenuItem>
        );
    }
    return dietList;
}

export const SearchBar = () => {
    const { getAxiosConfig } = useAuthContext();
    const [cuisineList, setCuisineList] = useState<React.ReactElement[]>([]);
    const [dietList, setDietList] = useState<React.ReactElement[]>([]);
    const [page, setPage] = useState<number>(1);

    const searchFormik = useFormik({
        initialValues: { search: '', cuisines: '', diets: '' },
        onSubmit: async (values: { search: string; cuisines: string; diets: string }) => {
            try {
                console.log(values);
            } catch (e: any) {
                console.log(e);
            }
        }
    });

    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);

    const cuisineData = useSWR('/recipes/cuisines/', fetcher);
    const dietData = useSWR('/recipes/diets/', fetcher);

    useEffect(() => {
        if (cuisineData.data) {
            setCuisineList(createCuisineList(cuisineData.data));
        }
        if (dietData.data) {
            setDietList(createDietList(dietData.data));
        }
    }, [dietData.data, cuisineData.data]);

    if (cuisineData.error || dietData.error) {
        return <h1>ERROR</h1>;
    }

    return (
        <Stack>
            <Box sx={{ justifyContent: 'center', width: '100%' }}>
                <FormikProvider value={searchFormik}>
                    <Form>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            id="search"
                            name="search"
                            label="Search"
                            placeholder={'Search for recipes here'}
                            value={searchFormik.values.search}
                            onChange={searchFormik.handleChange}
                            sx={{
                                width: '50%'
                            }}
                        />
                        <Select
                            id="cuisines"
                            name="cuisines"
                            value={searchFormik.values.cuisines}
                            onChange={searchFormik.handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="">
                                <em>Cuisine</em>
                            </MenuItem>
                            {cuisineList.map((element) => element)}
                        </Select>
                        <Select
                            id="diets"
                            name="diets"
                            value={searchFormik.values.diets}
                            onChange={searchFormik.handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="">
                                <em>Diet</em>
                            </MenuItem>
                            {dietList.map((element) => element)}
                        </Select>
                    </Form>
                </FormikProvider>
            </Box>
            {(searchFormik.values.cuisines ||
                searchFormik.values.diets ||
                searchFormik.values.search) && (
                <SearchRecipeGrid
                    page={page}
                    setPage={setPage}
                    limit={4}
                    search={searchFormik.values.search}
                    cuisine={searchFormik.values.cuisines}
                    diet={searchFormik.values.diets}
                ></SearchRecipeGrid>
            )}
        </Stack>
    );
};
