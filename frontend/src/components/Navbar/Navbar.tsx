import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import {
    AppBar,
    Box,
    Button,
    createTheme,
    IconButton,
    List,
    ListItemButton,
    Menu,
    MenuItem,
    Stack,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import http from '../../utils/http';
import Avatar from '@mui/material/Avatar';
import UserAvatar from '../UserAvatar/UserAvatar';
import UserInfo from './UserInfo/UserInfo';

// Source: https://mui.com/material-ui/react-app-bar/

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2'
        }
    }
});

const Navbar: React.FunctionComponent = () => {
    const { token, setToken } = useAuthContext();

    const loginAndRegisterButtons = () => {
        return (
            <Stack direction="row">
                <MenuItem component={Link} to="/login">
                    Login
                </MenuItem>
                <MenuItem component={Link} to="/register">
                    Register
                </MenuItem>
            </Stack>
        );
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseAndLogout = () => {
        setAnchorEl(null);
        setToken(null);
    };

    const createRecipeAndMyAccountButtons = () => {
        // Source: https://mui.com/material-ui/react-menu/
        return (
            <Stack direction="row">
                <MenuItem component={Link} to="/recipes/create">
                    Create a Recipe
                </MenuItem>
                <MenuItem onClick={handleMenu}>My Account</MenuItem>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem>
                        <UserInfo />
                    </MenuItem>
                    <MenuItem component={Link} to="/me" onClick={handleClose}>
                        Edit Profile
                    </MenuItem>
                    <MenuItem component={Link} to="/me/shopping-list" onClick={handleClose}>
                        Shopping List
                    </MenuItem>
                    <MenuItem component={Link} to="/me/recipes" onClick={handleClose}>
                        My Recipes
                    </MenuItem>
                    <MenuItem onClick={handleCloseAndLogout}>Logout</MenuItem>
                </Menu>
            </Stack>
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            component={Link}
                            to="/"
                            sx={{ mr: 2 }}
                        >
                            <CookieIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Easy Chef
                        </Typography>
                        {token ? createRecipeAndMyAccountButtons() : loginAndRegisterButtons()}
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    );
};

export default Navbar;
