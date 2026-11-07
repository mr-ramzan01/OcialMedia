import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { UserListItem } from "../common/UserListItem";
import { EmptyState } from "../common/EmptyState";

export const ShowFollowing = ({
  followingOpen,
  followingData,
  handleClose,
}) => {
  return (
    <Dialog maxWidth="xs" onClose={handleClose} open={followingOpen} fullWidth>
      <DialogTitle>Following</DialogTitle>
      <DialogContent dividers sx={{ p: 1, maxHeight: "60vh" }}>
        {followingData.length > 0 ? (
          <Stack spacing={0.25}>
            {followingData.map((el) => (
              <UserListItem key={el.follower_Id._id} user={el.follower_Id} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            image="/Images/user.png"
            title="Not following anyone yet"
            compact
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
