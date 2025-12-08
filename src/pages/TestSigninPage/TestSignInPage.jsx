import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInTest } from "../../api/auth";

export default function TestSignInPage() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (await signInTest()) {
                navigate("/");
            }
        })();
    }, [])

    return <div>Loading...</div>
}