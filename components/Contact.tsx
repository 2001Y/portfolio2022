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
               <form action="https://api.staticforms.xyz/submit" method="post">
                  <input
                     type="hidden"
                     name="Form Name"
                     value={name}
                  />
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
                     name="$問い合わせ"
                     placeholder="その他、ご自由にご記入ください。"
                  ></textarea>
                  <input type="text" name="honeypot" className="honeypot" />
                  <input type="hidden" name="replyTo" value="@" />
                  <input
                     type="hidden"
                     name="redirectTo"
                     value="https://2001y.me/contact/done"
                  />
                  <input
                     type="hidden"
                     name="accessKey"
                     value="44801933-9e6a-4b67-a226-63fe8599568b"
                  />
                  <input type="submit" value="送信" />
               </form>
            </div>
         </section>
      </>
   );
}
