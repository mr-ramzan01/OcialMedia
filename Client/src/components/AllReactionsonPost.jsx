import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { EmptyState } from "./common/EmptyState";
import { UserRowSkeleton } from "./common/Skeletons";
import { ReactionIcon } from "./common/ReactionIcon";
import { UserListItem } from "./common/UserListItem";
import { api } from "../utils/api";

export const AllReactionsonPost = ({
  data,
  showAllReactions,
  handelCloseShowReactions,
}) => {
  const [reactionsData, setReactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    api(`/api/likes/get/${data._id}`)
      .then((res) => {
        if (!ignore && res.success) setReactionsData(res.data);
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [data._id]);

  return (
    <Dialog
      maxWidth="xs"
      open={showAllReactions}
      onClose={handelCloseShowReactions}
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1.5,
        }}
      >
        Reactions
        <IconButton onClick={handelCloseShowReactions} aria-label="Close">
          <IoClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 1, maxHeight: 420 }}>
        {isLoading ? (
          <UserRowSkeleton count={4} dense />
        ) : reactionsData.length > 0 ? (
          <Stack spacing={0.25}>
            {reactionsData.map((el) => (
              <UserListItem
                key={el._id}
                user={el.like_by}
                trailing={<ReactionIcon type={el.like_type} />}
              />
            ))}
          </Stack>
        ) : (
          <EmptyState
            compact
            title="No reactions yet"
            subtitle="Be the first to react to this post."
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
