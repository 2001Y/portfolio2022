import Link from 'next/link'
import AdSence from "components/AdSence/AdSence"
import css_CutomH2 from "components/unified/CutomH2.module.scss"
export default function Output({ children }) {
    return (<>
        <div className={css_CutomH2.adsence}>
            <AdSence />
        </div>
        <h2>
            {children}
        </h2>
    </>)
}
