import React from "react";
import Manager from "./manager.js";
import ErrorBoundary from "../ErrorBoundary";
 export default function ManagerPage (){
  return(
    <div>
      <ErrorBoundary>
     <Manager/> 
     </ErrorBoundary>
    </div>
        
 );
}