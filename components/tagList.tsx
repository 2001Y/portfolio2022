import Link from "next/link";
import Image from "next/image";

import Blog_post from "components/widget/blog_post";
export default function ({ res }) {
    return (
        <>
            <ol>
                {res.map((e, i) => (
                    <li key={i}>
                        <h2>
                            <Link href={"/blog/tag/" + e.slug}>
                                <a>
                                    #{e.name} - {e.allCount}
                                </a>
                            </Link>
                        </h2>
                        <ol>
                            {e.tagList.map((e1, i1) => (
                                <li key={i1}>
                                    <Link href={"/blog/tag/" + e1.slug}>
                                        <a>
                                            #{e1.name} - {e1.allCount}
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                        <ul>
                            {e.postList.map((e1, i1) => (
                                <li key={i1}>
                                    <Blog_post res={e1} />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </>
    );
}
