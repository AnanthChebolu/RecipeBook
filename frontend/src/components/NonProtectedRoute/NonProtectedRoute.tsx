import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NonProtectedRouteProps {
    children?: React.ReactNode;
}

const NonProtectedRoute: React.FunctionComponent<NonProtectedRouteProps> = (
    props: NonProtectedRouteProps
) => {
    const { token } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    return <>{props.children}</>;
};

export default NonProtectedRoute;
