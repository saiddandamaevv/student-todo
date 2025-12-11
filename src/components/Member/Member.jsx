import { Box, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export default function MemberList({ members = [] }) {

  if (!Array.isArray(members)) {
    console.warn("Ожидался массив участников, получено:", members);
    return <Typography color="error">Ошибка: данные участников не в формате массива</Typography>;
  }

  if (members.length === 0) {
    return <Typography>Участников пока нет</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Участники проекта
      </Typography>
      <List>
        {members.map((member) => (
          <ListItem key={member.user_id}>
            <ListItemAvatar>
              <Avatar>
                <AccountCircle />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography variant="body1" component="div">
                    {member.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    {member.email}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="div">
                    {member.role || "—"}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}