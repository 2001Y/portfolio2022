import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import c_blog from "styles/blog.module.scss"
import c_heading from "styles/heading.module.scss";

export default function ({ res }) {
    return (
        <>
            <Link href={"/blog/" + res.slug}>
                <a>
                    <h3 className={c_heading.h3} dangerouslySetInnerHTML={{ __html: res.title }}></h3>
                    <ul className={c_blog.post_meta}>
                        <li>
                            <time>{res.date}</time>
                        </li>
                        <li>{res.voting.good}</li>
                        {res.tags && (
                            <li>
                                <ul className={classNames(c_blog.tagList)}>
                                    {res.tags.map((e2, i2) => (
                                        <li key={i2}>
                                            {/* <Link href={"/blog/tag/" + e2.slug}>
                                    <a> */}
                                            #{e2.name}
                                            {/* </a>
                                  </Link> */}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                </a>
            </Link>
        </>
    );
}
