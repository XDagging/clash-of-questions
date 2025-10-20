import { Link } from "react-router-dom"

export default function Index() {


    return (
        <>
        <p>this is the homepage</p>
        <Link to="/dashboard" className="link">Go to the dashboard</Link>
        </>
    )
}