import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from 'next/script'

export default function Output() {

    const { asPath } = useRouter()
    useEffect(() => {
        // var ads = document.getElementsByClassName("adsbygoogle").length;
        // for (var i = 0; i < ads; i++) {
        //     try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
        //     } catch (e) { }
        // }
    }, [asPath])
    // console.log(res)

    return (
        <>
            <Script
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750999099107987"
                crossOrigin="anonymous"
                async={true}
                strategy="afterInteractive"
                onError={(e) => { console.error('Script failed to load', e) }}
            />
            {/* <div className={"kooookoku"}>
                <div key={asPath}> */}
                    <ins className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-3750999099107987"
                        data-ad-slot="7157516277"
                        data-full-width-responsive="false"></ins>
                {/* </div>
                <div key={asPath}>
                    <ins className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-3750999099107987"
                        data-ad-slot="6726245863"
                        data-full-width-responsive="false"></ins>
                </div>
            </div> */}

        </>
    );
}