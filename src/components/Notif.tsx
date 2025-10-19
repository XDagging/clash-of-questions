import {useEffect} from "react";


interface props {
    message: string;
    type: string;
}


export default function Notif(props: props) {
    
    useEffect(() => {
        if (typeof props.message === "string" && props.message.length>0) {
            console.log("this was triggered")
            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scrolling
            });
        }   
    }, [props.message])
    // Props will specify color and message


    return (

        <>

        {(props.type==="err") && (
             <div className="md:fixed bottom-2 flex flex-col flex-start text-left font-2 bg-error text-error-content p-4 rounded-box md:max-w-xl w-5/6 mx-auto mt-2 right-2 z-50 "> 
             
             {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
</svg> */}
            <p className="font-bold">Uh oh! Something went wrong</p>
             <p className="">{props.message}</p>
 
            </div>
        )}
        {(props.type==="success") && (
            <div className="md:fixed bottom-2 flex flex-col flex-start text-left font-2 bg-success text-success-content p-4 rounded-box md:max-w-xl w-5/6 mx-auto mt-2 right-2 z-50 "> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
</svg>

<p className="font-bold">{props.message}</p>

        </div>

        )}
        
       
        
        
        </>
    )
}