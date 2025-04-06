import React from "react";
import Ceo from "./ceo.js";
import ErrorBoundary from "../ErrorBoundary";
 export default function CeoPage (){
  return(
    <div>
      <ErrorBoundary>
     <Ceo/> 
     </ErrorBoundary>
    </div>
        
 );
}