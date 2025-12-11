import { Box, Typography, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ← добавили
import React from 'react';

export default function Project({ id, name, description, change, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    change(index, id)
    if (id) {
      navigate(`/projects/${id}`); // → /projects/123
    } else {
      console.warn('Project ID is missing');
    }
  };

  return (
    <Box
      sx={{
        width: '320px',
        display: 'inline-block',
        verticalAlign: 'top',
        mx: 1,
        mb: 3,
        mt: 3,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        transition: 'all 0.2s ease',
      }}
      onClick={handleClick} // ← клик → переход
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Заголовок */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {name}
          </Typography>
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Описание */}
        <Box sx={{ p: 2, flexGrow: 1, overflow: 'hidden' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '4.5em',
            }}
          >
            {description}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}