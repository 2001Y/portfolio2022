import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import c_carousel from "styles/components/carousel.module.scss"
import classNames from "classnames";

export default function Embed({ res, imgSize }) {
    const containerRef = useRef(null);
    const [moduleState, setModuleState] = useState(true);
    const [nextState, setNextState] = useState(false);
    const [prevState, setPrevState] = useState(false);

    const handleScroll = (direction) => {
        if (direction === 'next') {
            containerRef.current.scrollLeft += containerRef.current.offsetWidth;
        } else if (direction === 'prev') {
            containerRef.current.scrollLeft -= containerRef.current.offsetWidth;
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            handleScroll('next');
            setNextState(true)
        } else if (event.key === 'ArrowLeft') {
            handleScroll('prev');
            setPrevState(true)
        }
    };
    const handleKeyUp = (event) => {
        if (event.key === 'ArrowRight') {
            setNextState(false)
        } else if (event.key === 'ArrowLeft') {
            setPrevState(false)
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className={c_carousel.carousel}
            style={{
                "--aspect": imgSize.aspect,
            } as any}
        >
            <div className={c_carousel.contents} ref={containerRef} onScroll={() => setModuleState(false)}>
                {res.map((embed, index) => (
                    <div key={index}  >
                        {embed.image && (
                            <Image
                                src={embed.image}
                                alt="embed image"
                                height={imgSize.height}
                                width={imgSize.width}
                            />
                        )}
                        {embed.code && (
                            <div dangerouslySetInnerHTML={{ __html: embed.code }} />
                        )}
                        {embed.youtube && (
                            <iframe
                                // className={classNames(c_works.youtube, {
                                //     [c_works.play]: state_youtube,
                                // })}
                                src={
                                    "https://www.youtube.com/embed/" +
                                    embed.youtube +
                                    "?autoplay=1"
                                }
                                title={res.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                ))}
            </div>

            {(res.length > 1) && (
                <>
                    <button
                        className={classNames(
                            c_carousel.nextButton,
                            { [c_carousel.active]: nextState }
                        )}
                        onClick={() => handleScroll('next')}
                    >
                        ＞
                    </button>
                    <button
                        className={classNames(
                            c_carousel.prevButton,
                            { [c_carousel.active]: prevState }
                        )}
                        onClick={() => handleScroll('prev')}
                    >
                        ＜
                    </button>
                    <div
                        className={classNames(
                            c_carousel.module,
                            { [c_carousel.open]: moduleState }
                        )}
                        onClick={() => setModuleState(false)}
                    >
                        矢印キー や 横スクロール でも操作できます。
                    </div>
                </>
            )}
        </div>
    );
}

