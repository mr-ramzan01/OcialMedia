import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { UserListItem } from "../common/UserListItem";
import { EmptyState } from "../common/EmptyState";

export const ShowFollower = ({ followersOpen, followersData, handleClose }) => {
  return (
    <Dialog maxWidth="xs" onClose={handleClose} open={followersOpen} fullWidth>
      <DialogTitle>Followers</DialogTitle>
      <DialogContent dividers sx={{ p: 1, maxHeight: "60vh" }}>
        {followersData.length > 0 ? (
          <Stack spacing={0.25}>
            {followersData.map((el) => (
              <UserListItem key={el.following_Id._id} user={el.following_Id} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            image="/Images/user.png"
            title="No followers yet"
            compact
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
