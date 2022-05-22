import Blog_post from "components/widget/blog_post";
import Works_post from "components/widget/works_post";
export default function ({ res }) {
    return (
        <>
            <h2>Blog</h2>
            <ul>
                {res.blog.map((e1, i1) => (
                    <li key={i1}>
                        <Blog_post res={e1} />
                    </li>
                ))}
            </ul>
            <h2>Works</h2>
            <ul>
                {res.works.map((e1, i1) => (
                    <li key={i1}>
                        <Works_post res={e1} />
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
    let blog = await GETpostList("&per_page=12&search=" + searchWord);
    let works = await GETwpList("/works?per_page=12&search=" + searchWord);
    return {
        props: {
            res: {
                blog,
                works,
            },
        },
    };
}
