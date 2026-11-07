import { Box, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";

/**
 * Image with a skeleton placeholder while loading, a fade-in on load,
 * and a neutral fallback when the source fails.
 */
export const SmartImage = ({
  src,
  alt = "",
  sx,
  imgSx,
  ratio,
  loading = "lazy",
  onClick,
  ...rest
}) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        aspectRatio: ratio,
        ...sx,
      }}
      {...rest}
    >
      {status === "loading" && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      )}
      {status === "error" ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "text.secondary",
            "& svg": { fontSize: 36 },
          }}
          aria-label="Image unavailable"
        >
          <IoImageOutline />
        </Box>
      ) : (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity .3s ease",
            ...imgSx,
          }}
        />
      )}
    </Box>
  );
};
