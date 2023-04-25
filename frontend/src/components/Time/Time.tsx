import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface TimeProps {
    prepTime: number;
    cookTime: number;
}

export const Time: React.FunctionComponent<TimeProps> = ({ prepTime, cookTime }) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        m: 1,
                        width: 128,
                        height: 128
                    }
                }}
            >
                <Typography variant="h6">Prep Time: {prepTime} minutes</Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        m: 1,
                        width: 128,
                        height: 128
                    }
                }}
            >
                <Typography variant="h6">Cook Time: {cookTime} minutes</Typography>
            </Box>
        </>
    );
};
