import { Box, Stack, Tooltip } from "@mui/material";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaAngry, FaLaughSquint, FaSadCry } from "react-icons/fa";
import { reactionColors } from "../../theme";

export const REACTIONS = [
  { type: "love", label: "Love", Icon: BsSuitHeartFill },
  { type: "funny", label: "Haha", Icon: FaLaughSquint },
  { type: "angry", label: "Angry", Icon: FaAngry },
  { type: "cry", label: "Sad", Icon: FaSadCry },
];

/** Colored icon for a reaction type. */
export const ReactionIcon = ({ type, size = 22, onClick, sx }) => {
  const r = REACTIONS.find((el) => el.type === type);
  if (!r) return null;
  const { Icon } = r;
  return (
    <Box
      component="span"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        color: reactionColors[type],
        cursor: onClick ? "pointer" : "default",
        lineHeight: 0,
        ...sx,
      }}
    >
      <Icon size={size} />
    </Box>
  );
};

/** Floating picker shown when hovering the heart. */
export const ReactionPicker = ({ onPick, sx }) => (
  <Stack
    direction="row"
    spacing={1.5}
    sx={{
      px: 1.5,
      py: 1,
      borderRadius: 999,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: 4,
      ...sx,
    }}
  >
    {REACTIONS.map(({ type, label, Icon }) => (
      <Tooltip key={type} title={label} arrow>
        <Box
          component="button"
          type="button"
          onClick={() => onPick(type)}
          sx={{
            border: 0,
            background: "none",
            p: 0.5,
            cursor: "pointer",
            color: reactionColors[type],
            lineHeight: 0,
            transition: "transform .15s",
            "&:hover": { transform: "scale(1.3) translateY(-2px)" },
          }}
        >
          <Icon size={24} />
        </Box>
      </Tooltip>
    ))}
  </Stack>
);
