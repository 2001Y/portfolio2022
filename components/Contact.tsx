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
            <button
               type="button"
               className={css.bg}
               aria-label="Contactを閉じる"
               onClick={() => stateOpen_set(!stateOpen)}
            ></button>
            <div
               className={css.modal}
            >
               <h3>Contact</h3>
               <form method="post" action="https://2001y-portfolio.form.newt.so/v1/ktMviMs9b">
                  <label htmlFor="contact-name">お名前</label>
                  <input id="contact-name" type="text" name="name" placeholder="田中 太郎" required />
                  <label htmlFor="contact-email">メールアドレス</label>
                  <input
                     id="contact-email"
                     type="text"
                     name="email"
                     placeholder="mail@example.com"
                     required
                  />
                  <label htmlFor="contact-body">お問い合わせ内容</label>
                  <textarea
                     id="contact-body"
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
