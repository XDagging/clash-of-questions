// import { useSession } from "next-auth/react";

// import * as culori from "culori";

// /**
//  * Grabs the computed background color of an element with a Tailwind class
//  * and converts it to a hex string, even if it's using oklch().
//  */
// export async function resolveTailwindBgHex(className: string): Promise<string | null> {
//   const el = document.createElement("div");
//   el.className = className;
//   el.style.display = "none";
//   document.body.appendChild(el);

//   const color = getComputedStyle(el).backgroundColor;
//   document.body.removeChild(el);

//   try {
//     const parsed = culori.parse(color);
//     if (parsed) {
//       return culori.formatHex(parsed);
//     }
//   } catch (err) {
//     console.error("Failed to parse color", err);
//   }

//   return null;
// }

export interface Session {
    user?: {
      jwt?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }
  
  export default function callApi(
    path: string,
    method: string,
    body?: any,
  ): Promise<any> {


    const endpoint = (window.location.href.includes("localhost")) ?  "https://localhost:443" : "https://api.clashofquestions.com";
      return new Promise(async (resolve, reject) => {
        try {
          const bodyString = JSON.stringify(body);
  
          let response: Response;
  
          if (method.toLowerCase() === "get") {
            response = await fetch(endpoint + path, {
              method: method.toUpperCase(),
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else {
            // POST
            response = await fetch(endpoint + path, {
              method: method.toUpperCase(),
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: bodyString,
            });
          }
  
          resolve(response.json());
        } catch (error) {
          reject(error);
        }
      });
    
  }
  
  function isString(str: string, lengthLimit: number = 1000000): boolean {
    for (let i = 0; i < str.length; i++) {
      if (!isNaN(Number(str[i])) && str[i] !== " " && str[i] !== "-") {
        console.log("the character that failed us is,", str[i]);
        return false;
      }
    }
  
    return str.length < lengthLimit;
  }
  
  function isPassword(password: string): boolean {
    let passedTests = true;
  
    if (password.length < 4) {
      passedTests = false;
    } else if (password.length > 15) {
      passedTests = false;
    }
  
    return passedTests;
  }
  
  function isEmail(email: string): boolean {
    let passedTests = true;
  
    if (email.split("@").length !== 2) {
      passedTests = false;
    } else if (email.length < 4) {
      passedTests = false;
    } else if (email.length > 100) {
      passedTests = false;
    }
  
    return passedTests;
  }
  
  function formatString(str: string): string {
    return str
      .trim()
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }
  
  function convertTime(unixTimestamp: number | null): string {
    if (unixTimestamp === null) {
      return "N/A";
    } else {
      const currentTime = Date.now();
      const differenceInMilliseconds = currentTime - unixTimestamp;
      const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
      );
  
      if (differenceInDays < 365) {
        return `${differenceInDays} days`;
      } else {
        const differenceInYears = Math.floor(differenceInDays / 365);
        return `${differenceInYears} years`;
      }
    }
  }
  
  export { callApi, isString, isEmail, isPassword, formatString, convertTime };