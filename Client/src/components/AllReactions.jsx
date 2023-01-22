import React from 'react'

export const AllReactions = () => {
  return (
    <>
    <Dialog open={showReactions} onClose={handleSClosehowReactions}>
        <Box
          maxHeight="200px"
          overflow="scroll"
          sx={{ "&::-webkit-scrollbar": { width: "0" } }}
        >
          {reactionsData.length > 0 ? (
            <Stack direction="column" gap="10px" padding="15px">
              {reactionsData.map((el) => (
                <Stack
                  key={el._id}
                  direction="row"
                  alignItems="center"
                  gap="15px"
                >
                  <Avatar src={el.like_by.image} />
                  <Link
                    href={`/${el.like_by.username}`}
                    underline="none"
                    color="#000"
                  >
                    <Typography
                      fontFamily={"Dancing Script"}
                      fontSize="22px"
                      fontWeight="600"
                    >
                      {el.like_by.username}
                    </Typography>
                  </Link>
                  <Box>
                    {el.like_type === "love" && (
                      <BsSuitHeartFill
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="red"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "funny" && (
                      <FaLaughSquint
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#eb9800"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "cry" && (
                      <FaSadCry
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#00baff"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {el.like_type === "angry" && (
                      <FaAngry
                        onClick={handleRemoveLikes}
                        fontSize="25px"
                        color="#c30909"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Box
              height="100%"
              display="flex"
              p="20px 0"
              alignItems="center"
              justifyContent="center"
            >
              <Typography>No Reactions to Show</Typography>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  )
}
