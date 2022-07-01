import Head from "next/head";
const _V = require("./_V.js");

function Page({ title, description, ogp, url, breadcrumb }) {
   if (title) {
      var title = title + "｜" + _V.meta.siteTitle;
   } else {
      var title = "英語専門塾 " + _V.meta.siteTitle;
   }

   if (breadcrumb) {
      breadcrumb = breadcrumb.map((e, i) => ({
         "@type": "ListItem",
         position: i + 1,
         name: e[0],
         item: _V.meta.baseURL + e[1],
      }));
      breadcrumb = {
         "@context": "https://schema.org",
         "@type": "BreadcrumbList",
         itemListElement: breadcrumb,
      };
   }
   // console.log(breadcrumb);

   return (
      <Head>
         <meta property="og:type" content="article" />
         <meta name="twitter:card" content="summary_large_image" />
         {/* <meta name="twitter:site" content="@tcr_jp" /> */}
         {_V.meta.siteTitle && (
            <>
               <meta property="og:site_name" content={_V.meta.siteTitle} />
            </>
         )}
         {title && (
            <>
               <title>{title}</title>
               <meta property="og:title" content={title} />
            </>
         )}
         {ogp && (
            <>
               <meta property="og:image" content={ogp} />
            </>
         )}
         {url && (
            <>
               <meta property="og:url" content={url} />
               <link rel="canonical" href={url} />
            </>
         )}
         {description && (
            <>
               <meta property="og:description" content={description} />
            </>
         )}
         {breadcrumb && (
            <>
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
               />
            </>
         )}
      </Head>
   );
}

export default Page;
