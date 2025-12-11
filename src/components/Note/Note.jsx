import { Box, Divider, Paper, Typography } from "@mui/material";
import "./styles.scss";
import React from "react"

export default function Note(props) {
    return <Box
        sx={{
            padding: 3,
            width: "600px",
            textAlign: "center",
            display: "inline-block"
        }}
    >
        <Box
            className="note"
            onClick={() => props.onNoteClick({
                title: props.title,
                text: props.text
            })}
            sx={{
                bgcolor: "divider",
                height: "200px",
                borderRadius: "10px",
                padding: 3,
                mt: 1,
                textAlign: "left",
                cursor: "pointer",
            }}>
            <Typography>
                {props.text}
            </Typography>
        </Box>
        <Typography
            sx={{
                mt: '7px'
            }}
        >{props.title}</Typography>
        <Typography
            sx={{
                color: "text.secondary"
            }}
        >{props.createdAt}</Typography>
    </Box>
}

