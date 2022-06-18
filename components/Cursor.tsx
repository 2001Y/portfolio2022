import { useEffect, useState } from "react";
export default function () {
   useEffect(() => {
      document.onmousemove = function (e) {
         // console.log(e.pageX);
         // document.querySelector("#cursor").style.left = e.pageY;
         document.getElementById("cursor").style.top = e.pageX;
      };
   })
   return (
      <>
         <div className="cursor" id="cursor">
            a
         </div>
      </>
   );
}