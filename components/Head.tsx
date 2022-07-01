import Head from "next/head";

function Page(props) {
   let res = JSON.parse(JSON.stringify(props));
   if (res.title) {
      res.title = res.title;
   } else {
      res.title = process.env.title;
   }

   // if (res.breadcrumb) {
   //    res.breadcrumb = res.breadcrumb.map((e, i) => ({
   //       "@type": "ListItem",
   //       position: i + 1,
   //       name: e[0],
   //       item: _V.meta.baseURL + e[1],
   //    }));
   //    res.breadcrumb = {
   //       "@context": "https://schema.org",
   //       "@type": "BreadcrumbList",
   //       itemListElement: res.breadcrumb,
   //    };
   // }

   return (
      <Head>
         <meta property="og:type" content="article" />
         <meta name="twitter:card" content="summary_large_image" />
         {/* <meta name="twitter:site" content="@tcr_jp" /> */}
         {process.env.title && (
            <>
               <meta property="og:site_name" content={process.env.title} />
            </>
         )}
         {res.title && (
            <>
               <title>{res.title}</title>
               <meta property="og:title" content={res.title} />
            </>
         )}
         {res.ogp && (
            <>
               <meta property="og:image" content={res.ogp} />
            </>
         )}
         {res.url && (
            <>
               <meta property="og:url" content={res.url} />
               <link rel="canonical" href={res.url} />
            </>
         )}
         {res.description && (
            <>
               <meta property="og:description" content={res.description} />
            </>
         )}
         {res.breadcrumb && (
            <>
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(res.breadcrumb) }}
               />
            </>
         )}
      </Head>
   );
}

export default Page;
