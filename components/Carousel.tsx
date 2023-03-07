import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import c_carousel from "styles/components/carousel.module.scss"
import classNames from "classnames";

export default function Embed({ res, imgSize }) {

    const containerRef = useRef(null);
    const [zoomState, setZoomState] = useState(false);
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
            setNextState(true)
        } else if (event.key === 'ArrowLeft') {
            setPrevState(true)
        }
    };
    const handleKeyUp = (event) => {
        if (event.key === 'ArrowRight') {
            handleScroll('next');
            setNextState(false)
        } else if (event.key === 'ArrowLeft') {
            handleScroll('prev');
            setPrevState(false)
        } else if (event.key === 'Escape') {
            zoomState && setZoomState(false);
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

    useEffect(() => {
        window.document.documentElement.setAttribute("data-header", String(!zoomState));
    }, [zoomState]);

    return (
        <div
            className={classNames(
                c_carousel.thumbnail,
                { [c_carousel.zoom]: zoomState }
            )}
            style={{
                "--aspect": imgSize.aspect,
            } as any}
        >
            <div
                className={classNames(
                    c_carousel.carousel,
                    { [c_carousel.zoom]: zoomState }
                )}
                onDoubleClick={() => (setZoomState(!zoomState))}
            >
                <div className={c_carousel.contents} ref={containerRef} onScroll={() => setModuleState(false)}>
                    {res.map((embed, index) => (
                        <div key={index}  >
                            {embed.image && (
                                <Image
                                    src={embed.image}
                                    alt="embed image"
                                    width={830}
                                    height={830 * imgSize.aspect}
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


                        <div
                            className={classNames(
                                c_carousel.buttonList,
                                { [c_carousel.active]: nextState }
                            )}
                        >
                            {(res.length > 1) && (
                                <button
                                    className={classNames(
                                        c_carousel.prevButton,
                                        { [c_carousel.active]: prevState }
                                    )}
                                    onClick={() => handleScroll('prev')}
                                >
                                    ＜
                                </button>
                            )}
                            <button
                                className={classNames(
                                    c_carousel.zoomButton,
                                    { [c_carousel.active]: zoomState }
                                )}
                                onClick={() => (setZoomState(!zoomState))}
                            >
                                □
                            </button>
                            {(res.length > 1) && (
                                <button
                                    className={classNames(
                                        c_carousel.nextButton,
                                        { [c_carousel.active]: nextState }
                                    )}
                                    onClick={() => handleScroll('next')}
                                >
                                    ＞
                                </button>
                            )}
                        </div>
                        {(res.length > 1) && (
                            <div
                                className={classNames(
                                    c_carousel.module,
                                    { [c_carousel.open]: moduleState }
                                )}
                                onClick={() => setModuleState(false)}
                            >
                                矢印キー や 横スクロール でも操作できます。
                            </div>
                        )}
            </div>

            <div
                className={classNames(
                    c_carousel.zoomBackground,
                    { [c_carousel.zoom]: zoomState }
                )}
                onClick={() => (setZoomState(!zoomState))}
            >
            </div>

        </div>
    );
}

