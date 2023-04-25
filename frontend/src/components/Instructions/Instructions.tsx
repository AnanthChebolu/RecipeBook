import { Container, Typography } from '@mui/material';
import { Instruction, ImagesInterface, VideosInterface } from './Instruction/Instruction';
import React from 'react';

interface InstructionProp {
    images: ImagesInterface[];
    videos: VideosInterface[];
    prep_time: number | null;
    cooking_time: number | null;
    instruction: string;
    instruction_number: number;
}

interface InstructionsProps {
    instructions: InstructionProp[];
}
export const Instructions: React.FunctionComponent<InstructionsProps> = ({ instructions }) => {
    return (
        <Container
            sx={{
                pt: 2,
                pb: 2
            }}
            maxWidth="md"
        >
            <Typography variant="h4" component="h2">
                Instructions
                <hr style={{ marginTop: '0.5rem' }} />
            </Typography>
            {instructions.map((instruct) => (
                <Instruction
                    key={instruct.instruction_number}
                    images={instruct.images}
                    videos={instruct.videos}
                    prep_time={instruct.prep_time}
                    cooking_time={instruct.cooking_time}
                    instruction={instruct.instruction}
                    instruction_number={instruct.instruction_number}
                />
            ))}
        </Container>
    );
};
