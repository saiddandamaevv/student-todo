import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';


const FloatingButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),  
    width: "75px",
    height: "75px",
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1) rotate(90deg)'
    },
    '&:active': {
        transform: 'scale(0.95)'
    }
}));

export default function FloatingActionButton({ onClick }) {
    return (
        <FloatingButton 
        color="primary" 
        aria-label="add"
        onClick={onClick}
        >
        <AddIcon />
        </FloatingButton>
    );
}