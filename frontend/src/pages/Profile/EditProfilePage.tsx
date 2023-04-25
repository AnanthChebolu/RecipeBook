import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import EditProfileForm from '../../components/EditProfileForm/EditProfileForm';
import FoodImageList from '../../components/FoodImageList/FoodImageList';
import { Grid } from '@mui/material';
import useSWR from 'swr';
import http from '../../utils/http';
import { useAuthContext } from '../../context/AuthContext';

const EditProfilePage: React.FunctionComponent = () => {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        avatarURL: ''
    });

    const getProfileInfoURL = '/accounts/profile/view/';
    const { getAxiosConfig } = useAuthContext();

    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const { data, error, isLoading, mutate } = useSWR(getProfileInfoURL, fetcher);

    useEffect(() => {
        if (data) {
            setUserInfo({
                ...userInfo,
                firstName: data.first_name ? data.first_name : '',
                lastName: data.last_name ? data.last_name : '',
                email: data.email ? data.email : '',
                username: data.username ? data.username : '',
                phoneNumber: data.phone_number ? data.phone_number : '',
                avatarURL: data.avatar ? data.avatar : ''
            });
        }
    }, [data, error, isLoading]);

    if (isLoading) return <h1>Loading</h1>;

    if (error) return <h1>An error occurred</h1>;

    return (
        <ProtectedRoute>
            <PageLayout title="Edit Profile" maxWidth={'xl'}>
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <FoodImageList />
                    </Grid>
                    <Grid item xs={5}>
                        <EditProfileForm
                            mutate={mutate}
                            avatarURL={userInfo.avatarURL}
                            firstName={userInfo.firstName}
                            lastName={userInfo.lastName}
                            username={userInfo.username}
                            email={userInfo.email}
                            phoneNumber={userInfo.phoneNumber}
                        />
                    </Grid>
                </Grid>
            </PageLayout>
        </ProtectedRoute>
    );
};

export default EditProfilePage;
