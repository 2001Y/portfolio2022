import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import c_V from "styles/_V.module.scss";
export default function ({ res }) {
    let router = useRouter();
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

    let [voting, setVoting] = useState(false);
    let [pageName, setPageName] = useState(router.pathname);
    return (
        <header className="header">
            <section className={String("fixed " + voting)}>
                <section>
                    <div className="headerTitle">
                        <div className={c_V.animeBG + " profileIMGwrap"}>
                            <div className="profileIMG">
                                <Image
                                    src="https://github.com/2001y.png"
                                    width={50}
                                    height={50}
                                />
                            </div>
                        </div>
                        <h1>
                            2001Y<span>@Y20010920T</span>
                        </h1>
                    </div>
                    <ul>
                        {[
                            ["Twitter", "https://twitter.com/y20010920t"],
                            ["Instagram", "https://www.instagram.com/y20010920t/"],
                            ["Facebook", "https://www.facebook.com/Yoshiki.Tam"],
                        ].map((e, i) => (
                            <>
                                <li key={i}>
                                    <Link href={e[1]}>
                                        <a target="_blank">{e[0]}</a>
                                    </Link>
                                </li>
                            </>
                        ))}
                    </ul>
                </section>
                <section>
                    <nav className={"menu " + pageName}>
                        <ul>
                            {[
                                ["Works", "/"],
                                ["Blog", "/blog"],
                                ["About", "/about"],
                            ].map((e, i) => (
                                <>
                                    <li key={i}>
                                        <Link href={e[1]}>
                                            <a onClick={() => setPageName(e[1])}>{e[0]}</a>
                                        </Link>
                                    </li>
                                </>
                            ))}
                        </ul>
                    </nav>
                </section>
                <section>
                    <div onClick={() => toggleDarkmode()}>spMenu</div>
                    <ul>
                        <li>filter</li>
                        <li onClick={() => toggleDarkmode()}>{String(darkmod)}</li>
                        <li onClick={() => setVoting(!voting)}>"投票"</li>
                        <li>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    console.log(e);
                                    router.push({
                                        pathname: "/search",
                                        query: {
                                            ...router.query,
                                            s: e.target[0].value,
                                        },
                                    });
                                }}
                            >
                                <input required type="search" placeholder={router.query.s} />
                                {/* <input type="submit" value="送信" /> */}
                            </form>
                        </li>
                    </ul>
                </section>
            </section>
            <section className={String(voting)}>
                <h2>GOOD & BAD</h2>
            </section>
        </header>
    );
}
