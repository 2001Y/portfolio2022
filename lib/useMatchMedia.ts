import { useState, useEffect } from "react";

export default function useMatchMedia(screenSize) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${screenSize}px)`);
        setIsSmallScreen(mediaQuery.matches);

        const handleMediaChange = (e) => setIsSmallScreen(e.matches);

        // イベントリスナーを登録
        mediaQuery.addListener(handleMediaChange);

        // コンポーネントがアンマウントされたときにリスナーを削除
        return () => mediaQuery.removeListener(handleMediaChange);
    }, [screenSize]);

    return isSmallScreen;
}