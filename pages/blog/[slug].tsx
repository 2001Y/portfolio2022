import TagListRender from "components/tagList";
export default function ({ res }) {
    return (
        <>
            <h1 dangerouslySetInnerHTML={{ __html: res.title }}></h1>
            <time>{res.date}</time>
            <article dangerouslySetInnerHTML={{ __html: res.content }}></article>
        </>
    );
}

import { GETpost } from "lib/fetch";
export async function getStaticProps({ params }) {
    return {
        props: {
            res: await GETpost(params.slug)
        },
    };
}

import { GETwpList } from "lib/fetch";
export async function getStaticPaths() {
    // 外部APIエンドポイントを呼び出して記事を取得します。
    let res = await GETwpList("/posts?per_page=100&_fields=slug")
    res = res.map(e => e.slug)

    // 記事に基づいてプリレンダリングしたいパスを取得します
    var paths = res.map((slug) => ({
        params: { slug },
    }));

    // ビルド時にこれらのパスだけをプリレンダリングします。
    // { fallback: false } は他のルートが404になることを意味します。
    return { paths, fallback: false };
}
