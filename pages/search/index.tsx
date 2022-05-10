import Blog_post from "components/widget/blog_post";
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
        </>
    );
}

import { GETwpList } from "lib/fetch";
export async function getServerSideProps(e) {
    let searchWord = e.query.s;
    let blog = await GETwpList(
        "/posts?per_page=12&_fields=title,slug,date,voting,tags&search=" +
        searchWord
    );
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
