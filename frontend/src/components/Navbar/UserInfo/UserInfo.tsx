import React, { useEffect, useState } from 'react';
import http from '../../../utils/http';
import useSWR from 'swr';
import Avatar from '@mui/material/Avatar';
import UserAvatar from '../../UserAvatar/UserAvatar';
import { MenuItem } from '@mui/material';
import { useAuthContext } from '../../../context/AuthContext';

const UserInfo: React.FunctionComponent = () => {
    const { getAxiosConfig } = useAuthContext();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        avatar: ''
    });

    const getProfileInfoURL = '/accounts/profile/view/';

    const fetcher = (url: string) => http.get(url, getAxiosConfig()).then((res) => res.data);
    const { data, error, isLoading } = useSWR(getProfileInfoURL, fetcher);

    useEffect(() => {
        if (data) {
            setUser({
                firstName: data.first_name,
                lastName: data.last_name,
                username: data.username,
                email: data.email,
                phone: data.phone_number,
                avatar: data.avatar
            });
        }

        if (error) console.log(error);
    }, [data, error, isLoading]);

    let profileInfo;

    if (data) {
        const avatar = user.avatar ? (
            <Avatar src={user.avatar} />
        ) : (
            <UserAvatar
                name={
                    user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username
                }
            />
        );

        profileInfo = (
            <div>
                <div>{avatar}</div>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>{user.phone}</div>
            </div>
        );
    } else {
        if (error) {
            profileInfo = 'Error';
        } else if (isLoading) {
            profileInfo = 'Loading';
        }
    }

    return <>{profileInfo}</>;
};

export default UserInfo;
