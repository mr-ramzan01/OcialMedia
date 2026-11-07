import { Box, Card, Skeleton, Stack } from "@mui/material";

/* Shared skeleton loaders. All use the theme's divider/action colors via MUI Skeleton. */

const shimmer = { animation: "wave" };

export const PostCardSkeleton = () => (
  <Card sx={{ overflow: "hidden" }} aria-hidden>
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "center", px: 2, py: 1.5 }}
    >
      <Skeleton variant="circular" width={42} height={42} {...shimmer} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="35%" height={18} {...shimmer} />
        <Skeleton width="20%" height={14} {...shimmer} />
      </Box>
    </Stack>
    <Skeleton
      variant="rectangular"
      sx={{ width: "100%", height: { xs: 340, sm: 420, md: 520 } }}
      {...shimmer}
    />
    <Box sx={{ px: 2, py: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
        <Skeleton variant="circular" width={28} height={28} {...shimmer} />
        <Skeleton variant="circular" width={28} height={28} {...shimmer} />
      </Stack>
      <Skeleton width="60%" height={18} {...shimmer} />
      <Skeleton width="40%" height={16} {...shimmer} />
    </Box>
  </Card>
);

export const FeedSkeleton = ({ count = 2 }) => (
  <Stack spacing={3}>
    {Array.from({ length: count }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </Stack>
);

export const TileGridSkeleton = ({ count = 6 }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: { xs: 1, md: 1.5 },
    }}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        sx={{ aspectRatio: "1 / 1", height: "auto", borderRadius: 2 }}
        {...shimmer}
      />
    ))}
  </Box>
);

export const UserRowSkeleton = ({ count = 4, dense = false }) => (
  <Stack spacing={0.5} aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <Stack
        key={i}
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", px: 1.25, py: dense ? 0.75 : 1 }}
      >
        <Skeleton
          variant="circular"
          width={dense ? 36 : 44}
          height={dense ? 36 : 44}
          {...shimmer}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={18} {...shimmer} />
          <Skeleton width="60%" height={14} {...shimmer} />
        </Box>
      </Stack>
    ))}
  </Stack>
);

export const ProfileHeaderSkeleton = () => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={3}
    sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
    aria-hidden
  >
    <Skeleton
      variant="circular"
      sx={{
        width: { xs: 84, md: 140 },
        height: { xs: 84, md: 140 },
        flexShrink: 0,
      }}
      {...shimmer}
    />
    <Box sx={{ flex: 1, width: "100%" }}>
      <Skeleton width="40%" height={36} {...shimmer} />
      <Stack direction="row" spacing={3} sx={{ my: 1.5 }}>
        <Skeleton width={60} height={40} {...shimmer} />
        <Skeleton width={60} height={40} {...shimmer} />
        <Skeleton width={60} height={40} {...shimmer} />
      </Stack>
      <Skeleton width="30%" height={20} {...shimmer} />
      <Skeleton width="55%" height={16} {...shimmer} />
    </Box>
  </Stack>
);

export const NotificationRowSkeleton = ({ count = 5 }) => (
  <Stack aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <Stack
        key={i}
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", py: 1.5 }}
      >
        <Skeleton variant="circular" width={40} height={40} {...shimmer} />
        <Skeleton sx={{ flex: 1 }} height={18} {...shimmer} />
        <Skeleton
          variant="rectangular"
          width={44}
          height={44}
          sx={{ borderRadius: 2 }}
          {...shimmer}
        />
      </Stack>
    ))}
  </Stack>
);

export const StoriesSkeleton = ({ count = 5 }) => (
  <Stack direction="row" spacing={2} aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <Stack key={i} spacing={0.75} sx={{ alignItems: "center" }}>
        <Skeleton variant="circular" width={60} height={60} {...shimmer} />
        <Skeleton width={48} height={12} {...shimmer} />
      </Stack>
    ))}
  </Stack>
);

export const CommentSkeleton = ({ count = 3 }) => (
  <Stack spacing={1.5} aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <Stack
        key={i}
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "flex-start" }}
      >
        <Skeleton variant="circular" width={32} height={32} {...shimmer} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="30%" height={16} {...shimmer} />
          <Skeleton width="80%" height={14} {...shimmer} />
        </Box>
      </Stack>
    ))}
  </Stack>
);

export const TextLineSkeleton = ({ width = "60%" }) => (
  <Skeleton width={width} height={16} {...shimmer} />
);

export const MessagesSkeleton = ({ count = 6 }) => (
  <Stack spacing={1.5} sx={{ p: 2 }} aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <Stack
        key={i}
        direction="row"
        sx={{ justifyContent: i % 2 ? "flex-end" : "flex-start" }}
      >
        <Skeleton
          variant="rounded"
          width={`${35 + ((i * 17) % 35)}%`}
          height={44}
          sx={{ borderRadius: 4 }}
          {...shimmer}
        />
      </Stack>
    ))}
  </Stack>
);
