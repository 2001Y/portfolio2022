import Link from "next/link";
import Image from "next/image";

import { useRecoilState } from "recoil"; //追加
import { darkmode } from "lib/atoms";
import { useEffect, useState } from "react";
export default function ({ res }) {
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            toggleDarkmode(true);
        }
    }, []);

    let [darkmod, setDarkmode] = useState(false);
    function toggleDarkmode(e) {
        let nowValue = e || !darkmod;
        setDarkmode(nowValue);
        window.document.documentElement.setAttribute("data-darkmode", nowValue);
    }

    return (
        <header>
            <section>
                <div>
                    <Image src="https://github.com/2001y.png" width={50} height={50} />
                </div>
                <ul>
                    {[
                        ["Twitter", "https://twitter.com/y20010920t"],
                        ["Instagram", "https://www.instagram.com/y20010920t/"],
                        ["Facebook", "https://www.facebook.com/Yoshiki.Tam"],
                    ].map((e) => (
                        <>
                            <li>
                                <Link href={e[1]}>
                                    <a target="_blank">{e[0]}</a>
                                </Link>
                            </li>
                        </>
                    ))}
                </ul>
                <h1>
                    <Link href={"/"}>
                        <a>2001Y</a>
                    </Link>
                </h1>
            </section>
            <section>
                <nav>
                    <ul>
                        {[
                            ["Works", "/"],
                            ["Blog", "/blog"],
                            ["About", "/about"],
                        ].map((e) => (
                            <>
                                <li>
                                    <Link href={e[1]}>
                                        <a>{e[0]}</a>
                                    </Link>
                                </li>
                            </>
                        ))}
                    </ul>
                </nav>
            </section>
            <section>
                <div>spMenu</div>
                <ul>
                    <li>filter</li>
                    <li onClick={() => toggleDarkmode()}>{String(darkmod)}</li>
                    <li>search</li>
                </ul>
            </section>
        </header>
    );
}
