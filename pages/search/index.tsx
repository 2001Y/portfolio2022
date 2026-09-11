import Blog_post from "components/widget/blog_post";
import Works_post from "components/widget/WorksList_post";
export default function Output({ res }) {
    return (
        <>
            <h2>Blog</h2>
            <ul>
                {res.blog.map((e1) => (
                    <li key={e1.id || e1.slug}>
                        <Blog_post res={e1} />
                    </li>
                ))}
            </ul>
            <h2>Works</h2>
            <ul>
                {res.works.map((e1) => (
                    <li key={e1.id || e1.slug}>
                        <Works_post res={e1} countSum={0}/>
                    </li>
                ))}
            </ul>
        </>
    );
}

import { GETpostList, GETwpList } from "lib/fetch";
export async function getServerSideProps(e) {
    let searchWord = e.query.s;
    ["　", ",", "/"].map((e, i) => {
        searchWord = searchWord.replace(e, "+");
    });
    let [blog, works] = await Promise.all([
        GETpostList("&per_page=12&search=" + searchWord),
        GETwpList("/works?per_page=12&search=" + searchWord),
    ]);
    return {
        props: {
            res: {
                blog,
                works,
            },
        },
    };
}
