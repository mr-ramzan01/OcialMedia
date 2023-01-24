import { Avatar, Box, Link, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment";

export const NotificationMessage = ({el, type, likeCount, commentCount}) => {

    const DateConvert = ({ date }) => {
        let newDate = moment(date).fromNow();
        const all = newDate.split(" ");
        all.splice(all.length - 1, 1);
        if (all[0] === "a" || all[0] === "an") {
          all[0] = 1;
        }
        if (all[1] === "few") {
          all[0] = "now";
          all.splice(1, 2);
        }
        if (all[1] === "second" || all[1] === "seconds") {
          all[1] = "s";
        }
        if (all[1] === "minute" || all[1] === "minutes") {
          all[1] = "m";
        }
        if (all[1] === "hour" || all[1] === "hours") {
          all[1] = "h";
        }
        if (all[1] === "day" || all[1] === "days") {
          all[1] = "d";
        }
        if (all[1] === "month" || all[1] === "months") {
          all[1] = "m";
        }
        if (all[1] === "year" || all[1] === "years") {
          all[1] = "y";
        }
    
        const updatedDate = all.join("");
        return (
          <Typography component="span" ml="5px" fontSize="13px">
            {" "}
            {updatedDate}
          </Typography>
        );
      };
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap="10px"
      >
        <Avatar src={el.from.image} alt="" />
        <Box
          direction="row"
          gap="10px"
          alignItems="center"
        >
          <Link
            component="span"
            href={`/${el.from.username}`}
            underline="none"
            color="#000"
          >
            <Typography
              component="span"
              fontFamily={"Dancing Script"}
              fontSize="20px"
              fontWeight="600"
            >
              {el.from.username}
            </Typography>
          </Link>
          <Typography component="span" mt="5px" ml="5px" fontSize="15px">
           {type === 'like' && (
            likeCount > 1 ? `and ${likeCount -1} others has reacted on your post` : `has reacted on your post`
           )}
           {type === 'follow' && ' is started following you'}
           {type === 'comment' && (
            commentCount > 1 ? `and ${commentCount} others has commented on your post`: `has commented on your post`
           )}

            <Box component="span" mt="5px">
              <DateConvert date={el.createdAt} />
            </Box>
          </Typography>
        </Box>
      </Stack>
    </>
  );
};
