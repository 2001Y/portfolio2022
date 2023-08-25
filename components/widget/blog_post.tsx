import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import c_blog from "styles/blog.module.scss"
import c_heading from "styles/heading.module.scss";

export default function Output({ res }) {
    return (
        <>
            <Link legacyBehavior href={"/blog/" + res.slug}>
                <a>
                    <h3 className={c_heading.h3} dangerouslySetInnerHTML={{ __html: res.title }}></h3>
                    <div className={c_blog.post_meta}>
                        <time content="Published">{res.date}</time>
                        <div>{res.voting.good}</div>
                        {res.tags && (
                            <ul className={classNames(c_blog.tagList)}>
                                {res.tags.map((e2, i2) => (
                                    <li key={i2}>
                                        #{e2.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </a>
            </Link>
        </>
    );
}
