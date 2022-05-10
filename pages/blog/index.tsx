import TagListRender from "components/tagList";

import css from "styles/blog.module.scss"
export default function ({ res }) {
    return (
        <>
            <h1 className={css.test}>Welcome to React Server Components</h1>
            <TagListRender res={res} />
        </>
    );
}

import { tagTop } from "lib/fetch";
export async function getStaticProps() {
    let res = await tagTop();
    return {
        props: {
            res: [res[3], res[0], res[1], res[2]]
        }
    };
}
