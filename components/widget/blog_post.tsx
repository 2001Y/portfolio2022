import Link from "next/link";
import Image from "next/image";

export default function ({ res }) {
    return (
        <>
            <Link href={"/blog/" + res.slug}>
                <a>
                    <h3 dangerouslySetInnerHTML={{ __html: res.title }}></h3>
                    <ul>
                        <li>
                            <time>{res.date}</time>
                        </li>
                        <li>{res.voting.good}</li>
                        {res.tags && (
                            <li>
                                <ul>
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
