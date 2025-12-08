import React from "react";
import "./styles.scss";
import { green, orange, red } from "@mui/material/colors";

export default function TimeProgress(props) {
    const ref = React.useRef();

    function animate() {
        const now = Date.now();
        const time = Math.min((now - props.start) / (props.end - props.start) * 100, 100);
        if (ref.current) {
            ref.current.style.width = `${time}%`;
            ref.current.style.backgroundColor = time > 75 ? red[500] : (time > 50 ? orange[400] : green[400]);
        }
        requestAnimationFrame(() => animate());
    }

    React.useEffect(() => {
        const id = requestAnimationFrame(() => animate());
        return () => cancelAnimationFrame(id);
    }, [props.end]);

    return <div style={{ width: "100%", height: 4, display: "flex", marginTop: 16 }}>
        <span ref={ref} className="progress-bar"></span>
    </div>
}