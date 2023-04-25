import * as React from 'react';
import Carousel from 'react-material-ui-carousel';
export interface CarouselInterface {
    url: string;
    id: number;
}
interface CarouselProps {
    mediaLinks: CarouselInterface[];
}

export const ImageCarousel: React.FunctionComponent<CarouselProps> = (props: CarouselProps) => {
    return (
        <Carousel
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '1000px', // Set the width to the max width of the images being rendered
                margin: '0 auto' // Center the Carousel using margin
            }}
        >
            {props.mediaLinks.map((item, i) => (
                <div key={i + 1000}>
                    {!item.url.includes('mp4') && (
                        <img
                            className="d-block w-100"
                            src={`http://localhost:8000${item.url}`}
                            alt="recipeImage"
                            height={500}
                            width={1000}
                        />
                    )}
                    {item.url.includes('mp4') && (
                        <video controls height={500} width={1000}>
                            <source src={`http://localhost:8000${item.url}`} type={'video/mp4'} />
                        </video>
                    )}
                </div>
            ))}
        </Carousel>
    );
};
