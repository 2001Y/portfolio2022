import classNames from "classnames";
import css from "styles/components/contact.module.scss";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Output({ name }) {
   let [stateOpen, stateOpen_set] = useState(false);
   return (
      <>
         <section className={classNames(
            css.overlay,
            { [css.open]: stateOpen }
         )}
         >
            <div
               className={css.bg}
               onClick={() => stateOpen_set(!stateOpen)}
            ></div>
            <div
               className={css.modal}
               onClick={() => stateOpen_set(true)}
            >
               <h3>Contact</h3>
               <form method="post" action="https://2001y-portfolio.form.newt.so/v1/ktMviMs9b">
                  <h6>お名前</h6>
                  <input type="text" name="name" placeholder="田中 太郎" required />
                  <h6>メールアドレス</h6>
                  <input
                     type="text"
                     name="email"
                     placeholder="mail@example.com"
                     required
                  />
                  <textarea
                     name="body"
                     placeholder="その他、ご自由にご記入ください。"
                  ></textarea>
                  <button type="submit">Submit</button>
               </form>
            </div>
         </section>
      </>
   );
}
